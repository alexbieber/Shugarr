from flask import Flask, render_template, redirect, url_for, flash, request
from flask_socketio import SocketIO, join_room, leave_room, send
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user

import config  # Import the config file
from forms import RegistrationForm, LoginForm, EditProfileForm # Import forms
from models import db, User, Room, Seat  # Import db and User from models.py
from flask import abort # For 404 errors

app = Flask(__name__, instance_relative_config=True)
socketio = SocketIO(app)

# Load configuration from config.py
app.config.from_object(config)
# Load instance-specific config if it exists
app.config.from_pyfile('config.py', silent=True)
app.config.setdefault('SECRET_KEY', 'dev_secret_key_for_flask_wtf_and_sessions')

# Initialize SQLAlchemy
db.init_app(app)

# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login' # Where to redirect if @login_required is hit
login_manager.login_message_category = 'info' # Flash message category

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/')
def home():
    return render_template('home.html', title='Home')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    form = RegistrationForm()
    if form.validate_on_submit():
        hashed_password = generate_password_hash(form.password.data, method='pbkdf2:sha256')
        new_user = User(username=form.username.data,
                        email=form.email.data,
                        password_hash=hashed_password)
        db.session.add(new_user)
        try:
            db.session.commit()
            flash('Your account has been created! You can now log in.', 'success')
            return redirect(url_for('login'))
        except Exception as e:
            db.session.rollback()
            flash(f'Error creating account: {e}', 'danger')
            app.logger.error(f"Error creating account: {e}") # Log the error
    return render_template('register.html', title='Register', form=form)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and check_password_hash(user.password_hash, form.password.data):
            login_user(user, remember=form.remember_me.data)
            flash('Login successful!', 'success')
            next_page = request.args.get('next') # For redirecting after login if @login_required was hit
            return redirect(next_page or url_for('dashboard'))
        else:
            flash('Login Unsuccessful. Please check email and password.', 'danger')
    return render_template('login.html', title='Login', form=form)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out.', 'info')
    return redirect(url_for('home'))

@app.route('/dashboard')
@login_required
def dashboard():
    rooms = Room.query.all()
    return render_template('dashboard.html', title='Dashboard', rooms=rooms)

@app.route('/profile')
@login_required
def profile():
    # Form is for editing, which will be a separate route/handler
    # form = EditProfileForm(obj=current_user)
    gifts = Gift.query.all()
    return render_template('profile.html', title='My Profile', user=current_user, gifts=gifts)

@app.route('/user/<username>')
@login_required # Optional: remove if profiles should be public
def user_profile(username):
    user = User.query.filter_by(username=username).first_or_404()
    # user = User.query.filter_by(username=username).first()
    # if user is None:
    #     abort(404) # Ensure you import abort from flask
    gifts = Gift.query.all()
    return render_template('profile.html', title=f"{user.username}'s Profile", user=user, gifts=gifts)

@app.route('/users')
@login_required # Optional: consider if this list should be public or require login
def users():
    all_users = User.query.all()
    return render_template('users.html', title='Browse Users', users=all_users)

# Placeholder for edit_profile route - to be implemented in a future subtask
@app.route('/edit_profile', methods=['GET', 'POST'])
@login_required
def edit_profile():
    form = EditProfileForm(obj=current_user)
    if form.validate_on_submit():
        # In a real implementation, you'd update current_user here
        # current_user.username = form.username.data # if allowing username changes
        # current_user.bio = form.bio.data
        # db.session.commit()
        flash('Profile updated (not really, this is a placeholder).', 'info')
        return redirect(url_for('profile'))
    return render_template('edit_profile.html', title='Edit Profile', form=form)

@app.route('/create_room', methods=['GET', 'POST'])
@login_required
def create_room():
    if request.method == 'POST':
        room_name = request.form.get('room_name')
        if room_name:
            room = Room(name=room_name, owner_id=current_user.id)
            db.session.add(room)
            db.session.commit()
            flash('Room created successfully!', 'success')
            return redirect(url_for('room', room_id=room.id))
    return render_template('create_room.html', title='Create Room')

@app.route('/room/<int:room_id>')
@login_required
def room(room_id):
    room = Room.query.get_or_404(room_id)
    return render_template('room.html', title=room.name, room=room)

@app.route('/join_room/<int:room_id>')
@login_required
def join_room(room_id):
    room = Room.query.get_or_404(room_id)
    current_user.room = room
    db.session.commit()
    flash(f'You have joined the room: {room.name}', 'success')
    return redirect(url_for('room', room_id=room.id))

@app.route('/leave_room/<int:room_id>')
@login_required
def leave_room(room_id):
    room = Room.query.get_or_404(room_id)
    if current_user.room == room:
        current_user.room = None
        db.session.commit()
        flash(f'You have left the room: {room.name}', 'info')
    return redirect(url_for('home'))


@socketio.on('join-room')
def handle_join_room(room_id, user_id):
    join_room(room_id)
    socketio.emit('user-connected', user_id, room=room_id)

@socketio.on('signal')
def handle_signal(user_id, signal):
    socketio.emit('signal', user_id, signal, include_self=False)

@socketio.on('disconnect')
def handle_disconnect():
    # This is a bit tricky, as we don't know which room the user was in.
    # A more robust solution would be to store the user's room in the session.
    pass

@app.route('/buy_coins', methods=['GET', 'POST'])
@login_required
def buy_coins():
    if request.method == 'POST':
        amount = int(request.form.get('amount'))
        user_coin_balance = UserCoinBalance.query.filter_by(user_id=current_user.id).first()
        if not user_coin_balance:
            user_coin_balance = UserCoinBalance(user_id=current_user.id)
            db.session.add(user_coin_balance)
        user_coin_balance.balance += amount
        db.session.commit()
        flash(f'You have successfully purchased {amount} coins!', 'success')
        return redirect(url_for('profile'))
    return render_template('buy_coins.html', title='Buy Coins')

@app.route('/send_gift/<int:recipient_id>', methods=['POST'])
@login_required
def send_gift(recipient_id):
    gift_id = int(request.form.get('gift_id'))
    gift = Gift.query.get_or_404(gift_id)
    sender_coin_balance = UserCoinBalance.query.filter_by(user_id=current_user.id).first()

    if sender_coin_balance and sender_coin_balance.balance >= gift.cost:
        sender_coin_balance.balance -= gift.cost
        # In a real application, you would also record the gift transaction.
        db.session.commit()
        flash(f'You have successfully sent a {gift.name} to the user!', 'success')
    else:
        flash('You do not have enough coins to send this gift.', 'danger')

    return redirect(url_for('profile', username=User.query.get(recipient_id).username))


if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create database tables if they don't exist
    socketio.run(app, debug=True)

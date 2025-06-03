from flask import Flask, render_template, redirect, url_for, flash, request
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from forms import LoginForm, RegistrationForm, EditProfileForm # Assuming forms.py is in the root
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key_here' # Change in production
app.config['TEMPLATES_AUTO_RELOAD'] = True # For development

# Flask-Login setup
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login' # The route to redirect to for login_required

# Mock User Store (In a real app, this would be a database)
users = {} # Store user objects by ID
user_email_index = {} # Store user ID by email for quick lookup

class User(UserMixin):
    def __init__(self, id, username, email, password_hash, about_me="", age=None, location="", interests="", profile_picture_url=""):
        self.id = id
        self.username = username
        self.email = email
        self.password_hash = password_hash
        self.about_me = about_me
        self.age = age
        self.location = location
        self.interests = interests
        self.profile_picture_url = profile_picture_url

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

@login_manager.user_loader
def load_user(user_id):
    return users.get(int(user_id))

# Create a dummy user for testing if not exists
if not users:
    new_id = 1
    hashed_password = generate_password_hash("testpassword")
    test_user = User(id=new_id, username="TestUser", email="test@example.com", password_hash=hashed_password,
                     about_me="This is a test user.", age=30, location="Test City", interests="Testing, Flask",
                     profile_picture_url=url_for('static', filename='images/default_profile.png', _external=True)) # Use external for initial set
    users[new_id] = test_user
    user_email_index[test_user.email] = new_id


@app.route('/')
def index():
    return render_template('index.html') # Assuming an index.html exists or will be created

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    form = RegistrationForm()
    if form.validate_on_submit():
        if form.email.data in user_email_index:
            flash('Email address already registered.', 'danger')
            return redirect(url_for('register'))

        new_id = len(users) + 1
        hashed_password = generate_password_hash(form.password.data)
        user = User(id=new_id, username=form.username.data, email=form.email.data, password_hash=hashed_password)
        users[new_id] = user
        user_email_index[form.email.data] = new_id
        flash('Your account has been created! You are now able to log in', 'success')
        return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form) # Assuming register.html

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    form = LoginForm()
    if form.validate_on_submit():
        user_id = user_email_index.get(form.email.data)
        user = users.get(user_id) if user_id else None
        if user and user.check_password(form.password.data):
            login_user(user)
            next_page = request.args.get('next')
            return redirect(next_page or url_for('dashboard'))
        else:
            flash('Login Unsuccessful. Please check email and password', 'danger')
    return render_template('login.html', title='Login', form=form) # Assuming login.html

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out.', 'info')
    return redirect(url_for('index'))

@app.route('/dashboard')
@login_required
def dashboard():
    # For now, let's assume a dashboard.html exists or redirect to profile
    # return render_template('dashboard.html', title='Dashboard')
    return redirect(url_for('profile'))


@app.route('/profile')
@login_required
def profile():
    # Pass the current_user object to the template
    return render_template('profile.html', user=current_user, title='Profile')

@app.route('/edit_profile', methods=['GET', 'POST'])
@login_required
def edit_profile():
    form = EditProfileForm(obj=current_user) # Pre-populate form on GET
    if form.validate_on_submit():
        # BACKEND_INTEGRATION (Edit Profile - POST):
        # 1. Update current_user attributes with validated form data:
        #    current_user.username = form.username.data
        #    current_user.email = form.email.data (handle email change carefully; consider verification)
        #    current_user.about_me = form.about_me.data
        #    current_user.age = form.age.data (ensure type conversion if model expects int)
        #    current_user.location = form.location.data
        #    current_user.interests = form.interests.data
        #    current_user.profile_picture_url = form.profile_picture_url.data
        # 2. Persist changes to the database (e.g., db.session.commit()).
        # 3. Handle potential exceptions during database operations.

        # Current mock implementation:
        current_user.username = form.username.data
        current_user.email = form.email.data
        current_user.about_me = form.about_me.data
        current_user.age = form.age.data
        current_user.location = form.location.data
        current_user.interests = form.interests.data
        current_user.profile_picture_url = form.profile_picture_url.data

        users[current_user.id] = current_user # Update in our mock user store
        # If email changed in mock store, update the email index (example logic)
        # This kind of logic would be handled by DB constraints or specific update methods with a real DB.
        for email, user_id_in_index in list(user_email_index.items()):
            if user_id_in_index == current_user.id and email != current_user.email:
                del user_email_index[email]
                user_email_index[current_user.email] = current_user.id
                break
        user_email_index[current_user.email] = current_user.id


        flash('Your profile has been updated!', 'success')
        return redirect(url_for('profile'))

    # For GET request, or if form validation fails on POST:
    # BACKEND_INTEGRATION (Edit Profile - GET):
    # The form is already pre-populated with current_user data using `EditProfileForm(obj=current_user)`.
    # If WTForms validation fails on POST, this template is re-rendered, and WTForms
    // will automatically display error messages next to the respective fields.
    return render_template('edit_profile.html', title='Edit Profile', form=form)

@app.route('/swipe')
@login_required
def swipe():
    # BACKEND_INTEGRATION (Swipe Page - GET):
    # This route renders the swipe page. The actual loading of profiles to swipe
    # is handled by static/js/swipe.js, which should make an API call (e.g., GET /api/profiles_to_swipe).
    # Optionally, this route could pre-load the first batch of profiles and pass them
    # to the template, which then passes them to swipe.js. This might improve initial load time.
    # For now, it just renders the template. See static/js/swipe.js for more detailed API comments.
    return render_template('swipe.html', title='Swipe Profiles')

@app.route('/messages')
@login_required
def messages():
    # BACKEND_INTEGRATION (Messages List - GET):
    # Replace mock_conversations with actual database queries.
    # 1. Fetch all conversations involving the current_user.
    # 2. For each conversation, determine the other participant (recipient).
    # 3. Get the last message for each conversation to display a snippet and timestamp.
    # 4. Determine if there are unread messages from the recipient in each conversation.
    # 5. Structure data for the template: a list of objects, each with:
    #    - recipient_id (ID of the other user)
    #    - recipient_name (Name of the other user, from User model)
    #    - last_message (Snippet of the last message text)
    #    - timestamp (Formatted timestamp of the last message)
    #    - unread (Boolean: true if current_user has unread messages from this recipient)
    # Order conversations by the timestamp of the last message (most recent first).

    # Mock data for demonstration:
    mock_conversations = [
        # Example: Find user "Alex P." in the mock DB to get their ID for recipient_id
        {'id': 1, 'recipient_id': next((uid for uid, u in users.items() if u.username == "Alex P."), 2), 'recipient_name': 'Alex P.', 'last_message': 'Hey there! How are you doing today?', 'timestamp': '10:30 AM', 'unread': True},
        {'id': 2, 'recipient_id': next((uid for uid, u in users.items() if u.username == "Jamie L."), 3), 'recipient_name': 'Jamie L.', 'last_message': 'Sounds good! See you then.', 'timestamp': 'Yesterday', 'unread': False},
        {'id': 3, 'recipient_id': next((uid for uid, u in users.items() if u.username == "Chris B."), 4), 'recipient_name': 'Chris B.', 'last_message': 'Can you send over the file?', 'timestamp': 'Mon', 'unread': True}
    ] # Note: The recipient_id logic here is purely for mock and might not find users if they don't exist.
    return render_template('messages.html', title='My Messages', conversations=mock_conversations)

@app.route('/chat/<int:user_id>')
@login_required
def chat(user_id):
    # user_id is the ID of the person the current_user is chatting with (the recipient).

    # BACKEND_INTEGRATION (Chat Page - GET):
    # 1. Fetch the recipient's user object/details (e.g., User.query.get(user_id)) to get their name.
    #    Handle cases where the user_id is invalid or the user doesn't exist.
    # 2. Initial chat messages are loaded by static/js/chat.js via an API call (see chat.js).
    #    This route primarily needs to provide `recipient_name` and `recipient_id` to the template
    #    so that chat.js can make its API calls.
    # 3. Optionally, when this page is loaded, mark messages from `user_id` to `current_user` as read.
    #    This involves updating message statuses in the database.

    recipient = users.get(user_id)
    if not recipient:
        flash('User not found.', 'danger')
        return redirect(url_for('messages'))

    recipient_name = recipient.username

    # The template chat.html will now use recipient_name and user_id (as recipient_id)
    # to initialize chat.js, which then fetches message history.
    return render_template('chat.html', title=f'Chat with {recipient_name}',
                           recipient_name=recipient_name, recipient_id=user_id)


if __name__ == '__main__':
    app.run(debug=True)

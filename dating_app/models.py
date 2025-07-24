from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin # Import UserMixin

# This 'db' instance will be initialized in app.py
db = SQLAlchemy()

class User(db.Model, UserMixin): # Inherit from UserMixin
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    bio = db.Column(db.Text, nullable=True)
    room_id = db.Column(db.Integer, db.ForeignKey('room.id'), nullable=True)
    seat_id = db.Column(db.Integer, db.ForeignKey('seat.id'), nullable=True)
    role = db.Column(db.String(20), default='user')
    owned_room = db.relationship('Room', backref='owner', uselist=False)

    def __repr__(self):
        return f'<User {self.username}>'

class Room(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    users = db.relationship('User', backref='room', lazy=True)
    seats = db.relationship('Seat', backref='room', lazy=True)

    def __repr__(self):
        return f"Room('{self.name}')"

class Seat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user = db.relationship('User', backref='seat', uselist=False)
    room_id = db.Column(db.Integer, db.ForeignKey('room.id'), nullable=False)

    def __repr__(self):
        return f"Seat('{self.id}')"

class Gift(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    cost = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f"Gift('{self.name}', '{self.cost}')"

class UserCoinBalance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    balance = db.Column(db.Integer, default=0)

    def __repr__(self):
        return f"UserCoinBalance('{self.user_id}', '{self.balance}')"

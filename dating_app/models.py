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

    def __repr__(self):
        return f'<User {self.username}>'

from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Email, EqualTo, Length

class RegistrationForm(FlaskForm):
    username = StringField('Username',
                           validators=[DataRequired(), Length(min=2, max=20)])
    email = StringField('Email',
                        validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6)])
    confirm_password = PasswordField('Confirm Password',
                                     validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Sign Up')

from wtforms import BooleanField # Import BooleanField for "Remember Me"

class LoginForm(FlaskForm):
    email = StringField('Email',
                        validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember_me = BooleanField('Remember Me')
    submit = SubmitField('Login')

from wtforms import TextAreaField # Import TextAreaField

class EditProfileForm(FlaskForm):
    username = StringField('Username', render_kw={'readonly': True}) # Display only for now
    bio = TextAreaField('Bio', validators=[Length(min=0, max=500)]) # Optional bio, max 500 chars
    submit = SubmitField('Update Profile')

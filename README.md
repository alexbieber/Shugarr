# Shugarr

Shugarr is a dating application built with Flask.

## Setup

To run this application, you need to have Python and pip installed.

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/shugarr.git
   cd shugarr
   ```

2. **Create a virtual environment and activate it:**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. **Install the dependencies:**

   ```bash
   pip install -r dating_app/requirements.txt
   ```

4. **Run the application:**

   ```bash
   python dating_app/app.py
   ```

   The application will be available at `http://127.0.0.1:5000`.

## Project Structure

The project is organized as follows:

- `dating_app/`: The main application directory.
  - `app.py`: The main Flask application file.
  - `config.py`: Configuration for the application.
  - `forms.py`: WTForms for handling user input.
  - `models.py`: SQLAlchemy database models.
  - `requirements.txt`: A list of the Python packages that the project depends on
  - `static/`: Static files (CSS, JavaScript, images).
  - `templates/`: HTML templates for the application.
  - `instance/`: Instance-specific configuration.

## Dependencies

The main dependencies are:

- Flask
- Flask-SQLAlchemy
- Flask-WTF
- Flask-Login

You can find all the dependencies in the `dating_app/requirements.txt` file.

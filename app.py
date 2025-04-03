from flask import Flask, render_template, request, redirect, url_for, flash
from flask_mail import Mail, Message
from flask_wtf.csrf import CSRFProtect
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')

csrf = CSRFProtect(app)

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://"
)

app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.environ.get('MAIL_USE_TLS', 'True') == 'True'
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = ('Vulcan Enterprises', os.environ.get('MAIL_USERNAME'))
app.config['RECIPIENT_EMAIL'] = os.environ.get('RECIPIENT_EMAIL')

mail = Mail(app)


def send_contact_email(form_data):
    """Send contact form data via email"""
    msg = Message(
        subject=f"Contact Form Submission from {form_data['first_name']} {form_data['last_name']}",
        recipients=[app.config['RECIPIENT_EMAIL']]
    )
    msg.body = f"""
    Contact Form Submission:
    
    Name: {form_data['first_name']} {form_data['last_name']}
    Email: {form_data['email']}
    Message:
    
    {form_data['message']}
    """
    mail.send(msg)


def send_newsletter_subscription(email):
    """Send newsletter subscription notification"""
    msg = Message(
        subject="New Newsletter Subscription",
        recipients=[app.config['RECIPIENT_EMAIL']]
    )
    msg.body = f"""
    New Newsletter Subscription:
    
    Email: {email}
    """
    mail.send(msg)


@app.route('/', methods=['GET', 'POST'])
def main():
    if request.method == 'POST':
        limiter.limit("5 per minute, 20 per hour")(lambda: 'form_submission')()

        if 'message' in request.form:
            form_data = {
                'first_name': request.form.get('first_name'),
                'last_name': request.form.get('last_name'),
                'email': request.form.get('email'),
                'message': request.form.get('message')
            }

            try:
                send_contact_email(form_data)
                flash('Your message has been sent. Thank you!', 'success')
            except Exception as e:
                app.logger.error(f"Error sending email: {e}")
                flash('There was an error sending your message. Please try again later.', 'danger')

        elif 'email' in request.form and len(request.form) == 1:  # Newsletter form
            email = request.form.get('email')

            try:
                send_newsletter_subscription(email)
                flash('Thank you for subscribing to our newsletter!', 'success')
            except Exception as e:
                app.logger.error(f"Error sending email: {e}")
                flash('There was an error processing your subscription. Please try again later.', 'danger')

        return redirect(url_for('main'))

    return render_template('index.html')


@app.route('/team')
def team():
    return render_template('team.html')


@app.route('/news')
def news():
    return render_template('news.html')


@app.route('/products')
def products():
    return render_template('products.html')


@app.route('/contact', methods=['GET', 'POST'])
@limiter.limit("5 per minute, 20 per hour")
def contact():
    if request.method == 'POST':
        form_data = {
            'first_name': request.form.get('first_name'),
            'last_name': request.form.get('last_name'),
            'email': request.form.get('email'),
            'message': request.form.get('message')
        }

        try:
            send_contact_email(form_data)
            flash('Your message has been sent. Thank you!', 'success')
        except Exception as e:
            app.logger.error(f"Error sending email: {e}")
            flash('There was an error sending your message. Please try again later.', 'danger')

        return redirect(url_for('contact'))

    return render_template('contact.html')


@app.errorhandler(429)
def ratelimit_handler(e):
    flash("Too many requests. Please try again later.", "danger")
    return redirect(url_for('main'))


if __name__ == '__main__':
    app.run(debug=True)

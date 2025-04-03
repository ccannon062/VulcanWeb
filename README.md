# Vulcan Enterprises Website

![Vulcan Enterprises](https://via.placeholder.com/468x100?text=Vulcan+Enterprises)

A Flask-based website for Vulcan Enterprises, showcasing innovative technology for enhancing visibility for firefighters. The site features a responsive design with Bootstrap and includes contact forms that send submissions directly to your email.

## Features

- Responsive design with Bootstrap 5
- Contact form functionality
- Newsletter subscription
- CSRF protection
- Rate limiting to prevent abuse
- Email notifications for form submissions

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript, Bootstrap 5
- **Backend**: Flask
- **Form Security**: Flask-WTF with CSRF protection
- **Rate Limiting**: Flask-Limiter
- **Email**: Flask-Mail

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file:

```
SECRET_KEY=your-secure-random-key
MAIL_SERVER=smtp.zoho.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@zoho.com
MAIL_PASSWORD="your-password"
RECIPIENT_EMAIL=your-email@zoho.com
```

## Setup and Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/vulcan-enterprises.git
cd vulcan-enterprises
```

2. Create a virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate
```

3. Install dependencies
```bash
pip install -r requirements.txt
```

4. Create a `.env` file with the required environment variables (see above)

5. Run the application
```bash
python app.py
```

The application will be available at `http://127.0.0.1:5000/`

## Form Submission System

All form submissions (contact forms and newsletter signups) are sent directly to the email address specified in the `RECIPIENT_EMAIL` environment variable. This eliminates the need for a database or admin dashboard.

## Security Features

- **CSRF Protection**: Prevents cross-site request forgery attacks
- **Rate Limiting**: Limits form submissions to prevent abuse (5 per minute, 20 per hour per IP)
- **TLS Email**: Secure transmission of form data via email
- **Environment Variables**: Sensitive information is kept out of the code

## Project Structure

```
vulcan-enterprises/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── .env                   # Environment variables (not in repo)
├── static/
│   ├── images/            # Website images
│   ├── style.css          # CSS styles
│   └── js/                # JavaScript files
└── templates/
    ├── base.html          # Base template
    ├── index.html         # Homepage
    ├── contact.html       # Contact page
    ├── products.html      # Products page
    ├── team.html          # Team page
    └── news.html          # News page
```

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Contact

For any questions or feedback, please contact us at [calebcannon@vulcan-enterprises.com](mailto:calebcannon@vulcan-enterprises.com)

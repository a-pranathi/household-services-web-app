import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from backend.utils.constants import Mailservice

def send_email(to, subject, content):
    message = MIMEMultipart()
    message["To"] = to
    message["Subject"] = subject
    message["From"] = Mailservice.SENDER_EMAIL

    message.attach(MIMEText(content, "html"))

    with smtplib.SMTP(host=Mailservice.SMTP_SERVER, port=Mailservice.SMTP_PORT) as client:
        client.send_message(message)
        client.quit()
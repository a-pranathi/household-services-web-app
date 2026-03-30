import time
import flask_excel
from celery import shared_task
from flask import render_template
from backend.models import db, User, ServiceCategory, Service, Booking, Review
from backend.celery.mail_service import send_email
from backend.utils.constants import BookingStatus, ArtifactType, GeneralConfig

@shared_task(bind = True, ignore_result = False)
def create_csv(self, artifact_type):
    if (artifact_type == ArtifactType.USERS):
        resource = User.query.with_entities(
            User.id, User.name, User.email, User.phone_number,
            User.area_code, User.address, User.created_at,
            User.updated_at, User.rating, User.servicecategory_id,
            User.experience, User.approval_status, User.active).all()
        column_names = ["id", "name", "email", "phone_number",
                        "area_code", "address", "created_at",
                        "updated_at", "rating", "servicecategory_id",
                        "experience", "approval_status", "active"]
    elif (artifact_type == ArtifactType.SERVICE_CATEGORIES):
        resource = ServiceCategory.query.all()
        column_names = [column.name for column in ServiceCategory.__table__.columns]        
    elif (artifact_type == ArtifactType.SERVICES):
        resource = Service.query.all()
        column_names = [column.name for column in Service.__table__.columns]
    elif (artifact_type == ArtifactType.BOOKINGS):
        resource = Booking.query.all()
        column_names = [column.name for column in Booking.__table__.columns]
    else:
        resource = Review.query.all()
        column_names = [column.name for column in Review.__table__.columns]
    
    csv_out = flask_excel.make_response_from_query_sets(resource, column_names=column_names, file_type="csv")

    task_id = self.request.id
    file_name =  GeneralConfig.DOWNLOAD_FILE_LOCATION.format(artifact_type=artifact_type, task_id=task_id)
    with open(file_name, "wb") as file:
        file.write(csv_out.data)
    return file_name

@shared_task(ignore_result = True)
def send_email_task(to, subject, content):
    send_email(to, subject, content)

@shared_task(ignore_result = True)
def send_booking_alert(booking_id):
    booking = Booking.query.get(booking_id)
    subject = f"Booking Information: Booking Id - {booking_id}, Status : {booking.status}"
    
    to = booking.customer.email
    content = render_template("booking.html", booking=booking, recipient_name=booking.customer.name)
    send_email(to, subject, content)

    if (booking.professional_id):
        to = booking.professional.email
        content = render_template("booking.html", booking=booking, recipient_name=booking.professional.name)
        send_email(to, subject, content)

@shared_task(ignore_result = True)
def send_daily_alert():
    subject = "Daily Reminder: Upcoming services..."
    customers = db.session.query(Booking.customer_id, User.name, User.email).filter(Booking.status == BookingStatus.CONFIRM, Booking.customer_id == User.id).distinct().all()

    if customers:
        for customer in customers:
            to = customer.email
            bookings = Booking.query.filter(Booking.customer_id == customer.customer_id, Booking.status == BookingStatus.CONFIRM).all()
            content = render_template("daily_reminder.html", bookings=bookings, recipient_name=customer.name, reportFor = "customer")
            send_email(to, subject, content)

    professionals = db.session.query(Booking.professional_id, User.name, User.email).filter(Booking.status == BookingStatus.CONFIRM, Booking.professional_id == User.id).distinct().all()

    if professionals:
        for professional in professionals:
            to = professional.email
            bookings = Booking.query.filter(Booking.professional_id == professional.professional_id, Booking.status == BookingStatus.CONFIRM).all()
            content = render_template("daily_reminder.html", bookings=bookings, recipient_name=professional.name, reportFor = "professional")
            send_email(to, subject, content)

@shared_task(ignore_result = True)
def send_monthly_alert():
    subject = "Monthly Report Details..."
    customers = db.session.query(Booking.customer_id, User.name, User.email).filter(Booking.customer_id == User.id).distinct().all()

    if customers:
        for customer in customers:
            to = customer.email
            bookings = Booking.query.filter(Booking.customer_id == customer.customer_id).all()
            content = render_template("monthly_report.html", bookings=bookings, recipient_name=customer.name, reportFor = "customer")
            send_email(to, subject, content)

    professionals = db.session.query(Booking.professional_id, User.name, User.email).filter(Booking.professional_id == User.id).distinct().all()

    if professionals:
        for professional in professionals:
            to = professional.email
            bookings = Booking.query.filter(Booking.professional_id == professional.professional_id).all()
            content = render_template("monthly_report.html", bookings=bookings, recipient_name=customer.name, reportFor = "professional")
            send_email(to, subject, content)
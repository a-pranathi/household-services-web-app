from datetime import datetime
from flask import request, jsonify, current_app as app
from flask_restful import Resource, fields, marshal_with, reqparse
from flask_security import auth_required, roles_accepted, current_user
from sqlalchemy import desc
from backend.models import Booking, db, Service
# from backend.api.servicecategory import service_category_fields
from backend.api.user import user_basic_fields
from backend.api.service import service_basic_fields
from backend.utils.utilities import BusinessValidationError, Message
from backend.utils.constants import BookingStatus, CacheConstants
from backend.celery.tasks import send_booking_alert

cache = app.cache

booking_fields = {
    "id" : fields.Integer,
    "customer_id" : fields.Integer,
    "service_id" : fields.Integer,
    "professional_id" : fields.Integer,
    "booking_date" : fields.DateTime,
    "service_date" : fields.DateTime,
    "status" : fields.String,
    "remarks" : fields.String,

    "customer" : fields.Nested(user_basic_fields),
    "service" : fields.Nested(service_basic_fields),
    "professional" : fields.Nested(user_basic_fields),
}

booking_parser = reqparse.RequestParser()
booking_parser.add_argument("id")
booking_parser.add_argument("customer_id")
booking_parser.add_argument("service_id")
booking_parser.add_argument("professional_id")
booking_parser.add_argument("booking_date")
booking_parser.add_argument("service_date")
booking_parser.add_argument("status")
booking_parser.add_argument("remarks")

class BookingAPI(Resource):
    @auth_required("token")
    @roles_accepted("admin", "professional", "customer")
    @marshal_with(booking_fields)
    def get(self, booking_id):
        booking = Booking.query.get(booking_id)

        if not booking:
            raise BusinessValidationError(status_code=404, error_code="BOOKING-001", error_message="Booking information not found")

        return booking

    @auth_required("token")
    @roles_accepted("admin", "professional", "customer")
    @marshal_with(booking_fields)
    def put(self, booking_id):
        
        booking = Booking.query.get(booking_id)

        if not booking:
            raise BusinessValidationError(status_code=404, error_code="BOOKING-001", error_message="Booking information not found")

        args = booking_parser.parse_args()
        customer_id = int(args.get("customer_id", None))
        service_id = int(args.get("service_id", None))
        status = args.get("status", None)

        if (customer_id != booking.customer_id):
            raise BusinessValidationError(status_code=404, error_code="BOOKING-002", error_message="Mismatch in booking customer id")

        if (service_id != booking.service_id):
            raise BusinessValidationError(status_code=404, error_code="BOOKING-003", error_message="Mismatch in booking service id")
        try:
            booking.professional_id = args.get("professional_id", None)
            booking.booking_date = datetime.strptime(args.get("booking_date", None), "%Y-%m-%d")
            booking.status = status
            booking.remarks = args.get("remarks", None)

            if (status == BookingStatus.CLOSE):
                booking.service_date = datetime.now()

        except:
            db.session.rollback()
            raise BusinessValidationError(status_code=404, error_code="BOOKING-006", error_message="Booking cant be deleted because it is processed")
        else:
            db.session.commit()
            send_booking_alert(booking_id)

        return booking

    @auth_required("token")
    @roles_accepted("admin", "professional", "customer")
    def delete(self, booking_id):
        booking = Booking.query.get(booking_id)

        if not booking:
            raise BusinessValidationError(status_code=404, error_code="BOOKING-001", error_message="Booking information not found")

        if booking.status != BookingStatus.REQUEST:
            raise BusinessValidationError(status_code=404, error_code="BOOKING-004", error_message="Booking cannott be deleted because it is processed")

        try:
            Booking.query.filter_by(id=booking_id).delete()
        except:
            db.session.rollback()
            raise BusinessValidationError(status_code=404, error_code="BOOKING-005", error_message="Error deleting the booking!")
        else:
            db.session.commit()

        return Message.getformattedMessage(f"Booking {booking_id} Deleted successfully"), 200

class BookingListAPI(Resource):

    @auth_required("token")
    @roles_accepted("admin", "professional", "customer")
    @marshal_with(booking_fields)
    def get(self):

        filterkey = request.args.get('filter')
        

        if (filterkey == "admin"):
           bookings = Booking.query.order_by(Booking.id.desc()).all()
        elif (filterkey == "customer"):
            bookings = Booking.query.filter(Booking.customer_id == current_user.id).order_by(Booking.id.desc()).all()
        elif (filterkey == "professional"):            
            bookings = Booking.query.filter(Booking.professional_id == current_user.id).order_by(Booking.id.desc()).all()
        elif (filterkey == BookingStatus.REQUEST):
            bookings = Booking.query.filter(Booking.status == filterkey,
                                            Booking.service_id == Service.id,
                                            Service.category_id == current_user.servicecategory_id).all()
        else:
            raise BusinessValidationError(status_code=404, error_code="BOOKING-007", error_message="Invalid booking filter key!")
    
        return bookings 

    @auth_required("token")
    @roles_accepted("admin", "professional", "customer")
    @marshal_with(booking_fields)
    def post(self):
        args = booking_parser.parse_args()
        inputbookingdate = datetime.strptime(args.get("booking_date", None), "%Y-%m-%d")

        try:
            booking = Booking(
                            customer_id = args.get("customer_id", None),
                            service_id = args.get("service_id", None),
                            booking_date = inputbookingdate,
                            status = BookingStatus.REQUEST,
                            remarks = args.get("remarks", None))

            db.session.add(booking)

        except Exception as e:
            db.session.rollback()
            raise BusinessValidationError(status_code=404, error_code="BOOKING-005", error_message=e)
        else:
            db.session.commit()
            send_booking_alert(booking.id)

        return Message.getformattedMessage("Booking created successfully"), 200
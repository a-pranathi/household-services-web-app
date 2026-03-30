from flask import current_app as app
from flask_restful import Api, Resource, fields, marshal_with
from flask_security import auth_required, roles_accepted, current_user
from sqlalchemy import func
from backend.models import *


bookingstatus_fields = {
    "request" : fields.Integer,
    "confirm" : fields.Integer,    
    "close" : fields.Integer,    
    "complete" : fields.Integer,    
}

review_fields = {
    "1" : fields.Integer,
    "2" : fields.Integer,    
    "3" : fields.Integer,    
    "4" : fields.Integer,    
    "5" : fields.Integer,    
}

servicebooking_fields = {
    'service_name': fields.String,
    'booking_count': fields.Integer
}

class BookingGraphAPI(Resource):
    @auth_required("token")
    @roles_accepted("admin", "professional", "customer")
    @marshal_with(bookingstatus_fields)
    def get(self):
        requests, confirms, closes, completes = 0, 0, 0, 0
        if current_user.roles[0] == 'admin':
            bookings = Booking.query.all()
        elif current_user.roles[0] == 'customer':
            bookings = Booking.query.filter(Booking.customer_id == current_user.id).all()
        elif current_user.roles[0] == 'professional':
            bookings = Booking.query.filter(Booking.professional_id == current_user.id).all()
        else:
            return {"message": "Unauthorized access"}, 
        for booking in bookings:
            if booking.status == "request":
                requests+=1
            elif booking.status == "confirm":
                confirms+=1
            elif booking.status == "close":
                closes+=1
            elif booking.status == "complete":
                completes+=1
        return {
            "request": requests,
            "confirm": confirms,
            "close": closes,
            "complete": completes
        }

class ReviewGraphAPI(Resource):
    @auth_required("token")
    @roles_accepted("admin", "professional", "customer")
    @marshal_with(review_fields)
    def get(self):
        one, two, three, four, five = 0, 0, 0, 0, 0
        if current_user.roles[0] == 'admin':
            reviews = Review.query.all()
        elif current_user.roles[0] == 'customer':
            reviews = Review.query.join(Booking).filter(Booking.customer_id == current_user.id).all()
        elif current_user.roles[0] == 'professional':
            reviews = Review.query.join(Booking).filter(Booking.professional_id == current_user.id).all()

        for review in reviews:
            if review.rating == 1:
                one+=1
            elif review.rating == 2:
                two+=1
            elif review.rating == 3:
                three+=1
            elif review.rating == 4:
                four+=1
            elif review.rating == 5:
                five+=1
        return {
            "1": one,
            "2": two,
            "3": three,
            "4": four,
            "5": five
        }

class ServiceGraphsAPI(Resource):
    @auth_required("token")
    @roles_accepted("admin", "professional", "customer")
    @marshal_with(servicebooking_fields)
    def get(self):
        if current_user.roles[0] == 'admin':
            results = db.session.query(Service.name, func.count(Booking.id).label('booking_count')).join(Booking).group_by(Service.id).all()
        elif current_user.roles[0] == 'customer':
            results = db.session.query(Service.name, func.count(Booking.id).label('booking_count')).join(Booking).group_by(Service.id).filter(Booking.customer_id == current_user.id).all()
        elif current_user.roles[0] == 'professional':
            results = db.session.query(Service.name, func.count(Booking.id).label('booking_count')).join(Booking).group_by(Service.id).filter(Booking.professional_id == current_user.id).all()

        data = [{'service_name': service_name, 'booking_count': booking_count} for service_name, booking_count in results]

        return data
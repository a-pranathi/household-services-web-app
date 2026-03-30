from flask import current_app as app
from flask_restful import Resource, fields, marshal_with, reqparse
from flask_security import auth_required, current_user, roles_accepted
from backend.models import Review, db, Booking, User
from backend.api.booking import booking_fields
from backend.utils.constants import CacheConstants
from backend.utils.utilities import BusinessValidationError
from backend.celery.tasks import send_booking_alert

cache = app.cache

review_fields = {
"id" : fields.Integer,
"booking_id" : fields.Integer,
"rating" : fields.Integer,
"remarks"  : fields.String,
"created_at" : fields.DateTime,
"booking" : fields.Nested(booking_fields)
}

review_parser = reqparse.RequestParser()
review_parser.add_argument("id")
review_parser.add_argument("booking_id")
review_parser.add_argument("rating")
review_parser.add_argument("remarks")

class ReviewAPI(Resource):

    @auth_required("token")
    @roles_accepted("admin", "professional", "customer")    
    @cache.memoize(timeout = CacheConstants.MEMOIZE_TIMEOUT)
    @marshal_with(review_fields)
    def get(self, review_id):
        review = Review.query.get(review_id)
    
        if not review:
            raise BusinessValidationError(status_code=404, error_code="REVIEW-001", error_message="review information not found!")
        return review

    @auth_required("token")
    @roles_accepted("customer")    
    @marshal_with(review_fields)
    def delete(self, review_id):
        review = Review.query.get(review_id)
    
        if not review:
            raise BusinessValidationError(status_code=404, error_code="REVIEW-001", error_message="review information not found!")

        if review.customer_id != current_user.id:
            raise BusinessValidationError(status_code=404, error_code="REVIEW-002", error_message="Not a valid user to delete the review!")

        try:
            db.session.delete(review)
        except:
            db.session.rollback()
            raise BusinessValidationError(status_code=404, error_code="REVIEW-003", error_message=f"Error deleteing the review{review_id}!")            
        else:
            db.session.commit()
        

class ReviewListAPI(Resource):
    @auth_required("token")
    @roles_accepted("admin", "professional", "customer")
    @cache.cached(timeout = CacheConstants.CACHED_TIMEOUT, key_prefix = "review_list")
    @marshal_with(review_fields)
    def get(self):
        reviews = Review.query.all()
        return reviews

    @auth_required("token")
    @roles_accepted("customer")
    @marshal_with(review_fields)    
    def post(self):
        args = review_parser.parse_args()
        booking_id = args.get("booking_id", None)
        reviewrating = args.get("rating", None)
        remarks = args.get("remarks", 0.0)

        booking = Booking.query.get(booking_id)

        if not booking:
            raise BusinessValidationError(status_code=404, error_code="REVIEW-004", error_message="Booking information not found")        

        try:
            review = Review(booking_id=booking_id,rating=reviewrating,remarks=remarks)
            booking.status = "complete"
            db.session.add(review)
            db.session.flush()

            professional = User.query.get(booking.professional_id)
            profbookings = Booking.query.filter(Booking.professional_id==professional.id).all()
            rating, count = 0, 0
            for profbooking in profbookings:
                review = Review.query.filter(Review.booking_id == profbooking.id).first()
                if review:
                    rating += int(review.rating)
                    count += 1
            rating /= count
            professional.rating = rating
            db.session.flush()
        except Exception as e:
            print("Exception: ", e)
            db.session.rollback()
            raise BusinessValidationError(status_code=404, error_code="REVIEW-005", error_message="Error creating review!")            
        else:
            db.session.commit()
            send_booking_alert(booking_id)
        
        return review

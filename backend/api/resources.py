from flask import current_app as app
from flask_restful import Api

cache = app.cache
api = Api(prefix="/api")

from backend.api.user import LoginAPI, RegisterAPI, UserAPI, UserListAPI, UserSearchAPI
from backend.api.servicecategory import ServiceCategoryAPI, ServiceCategoryListAPI, ServiceCategorySearchAPI
from backend.api.service import ServiceAPI, ServiceListAPI, ServiceSearchAPI
from backend.api.booking import BookingAPI, BookingListAPI
from backend.api.review import ReviewAPI, ReviewListAPI
from backend.api.graph import BookingGraphAPI, ReviewGraphAPI, ServiceGraphsAPI
from backend.api.download import CreateFileAPI, CheckFileStatusAPI, DownloadFileAPI


api.add_resource(LoginAPI, "/login")
api.add_resource(RegisterAPI, "/register")

api.add_resource(UserListAPI, "/users")
api.add_resource(UserAPI, "/users/<int:user_id>")
api.add_resource(UserSearchAPI, "/users/search/<search_query>")

api.add_resource(ServiceCategoryListAPI, "/servicecategories")
api.add_resource(ServiceCategoryAPI, "/servicecategories/<int:service_category_id>")
api.add_resource(ServiceCategorySearchAPI, "/servicecategories/search/<search_query>")

api.add_resource(ServiceListAPI, "/services")
api.add_resource(ServiceAPI, "/services/<int:service_id>")
api.add_resource(ServiceSearchAPI, "/services/search/<search_query>")

api.add_resource(BookingListAPI, "/bookings")
api.add_resource(BookingAPI, "/bookings/<int:booking_id>")

api.add_resource(ReviewListAPI, "/reviews")
api.add_resource(ReviewAPI, "/reviews/<int:review_id>")

api.add_resource(ServiceGraphsAPI, "/graph/servicebookings")
api.add_resource(BookingGraphAPI, "/graph/bookingstatus")
api.add_resource(ReviewGraphAPI, "/graph/reviews")

api.add_resource(CreateFileAPI, "/download/create/<string:artifact_type>")
api.add_resource(CheckFileStatusAPI, "/download/checkstatus/<string:task_id>")
api.add_resource(DownloadFileAPI, "/download/file/<string:task_id>")
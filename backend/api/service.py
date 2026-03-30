from datetime import datetime
from flask import request, jsonify, current_app as app
from flask_restful import Api, Resource, fields, marshal_with, reqparse
from sqlalchemy import or_
from flask_security import auth_required, roles_accepted, current_user
from backend.models import db, Service, ServiceCategory
from backend.api.servicecategory import service_category_fields
from backend.utils.constants import CacheConstants
from backend.utils.utilities import BusinessValidationError, Message

cache = app.cache

service_fields = {
"id" : fields.Integer,
"name" : fields.String,
"description" : fields.String,
"base_price" : fields.Float,
"time_required" : fields.Float,
"category_id" : fields.Integer,
"category_name" : fields.String,
"created_at" : fields.DateTime,
"updated_at" : fields.DateTime,
"servicecategory" : fields.Nested(service_category_fields),
}

service_parser = reqparse.RequestParser()
service_parser.add_argument("id")
service_parser.add_argument("name")
service_parser.add_argument("description")
service_parser.add_argument("base_price")
service_parser.add_argument("time_required")
service_parser.add_argument("category_id")

service_basic_fields = {
"id" : fields.Integer,
"name" : fields.String,
}

class ServiceAPI(Resource):
    @auth_required("token")
    @roles_accepted("admin", "professional", "customer")
    @cache.memoize(timeout = CacheConstants.MEMOIZE_TIMEOUT)
    @marshal_with(service_fields)
    def get(self, service_id):
        service = Service.query.get(service_id)

        if not service:
            return{"message": "Service information not found"}, 404
        
        return service

    @auth_required("token")
    @roles_accepted("admin", "professional", "customer")
    @marshal_with(service_fields)
    def put(self, service_id):
        service = Service.query.filter_by(id=service_id).first()

        if service:
            try:
                args = service_parser.parse_args()
                service.name = args.get("name", None)
                service.description = args.get("description", None)
                service.base_price = args.get("base_price", 0.0)
                service.time_required = args.get("time_required", 0.0)
                service.category_id = args.get("category_id", -1)
                service.updated_at = datetime.now()
            except Exception as e:
                db.session.rollback()
                print("Exception: ", e)
            else:
                db.session.commit()

            return service

    @auth_required("token")
    @roles_accepted("admin")
    def delete(self, service_id):   
        try:
            Service.query.filter_by(id=service_id).delete()
        except Exception as e:
            db.session.rollback()
            print("Exception: ", e)
        else:
            db.session.commit()

        return Message.getformattedMessage(f"Service {service_id} Deleted successfully"), 200

class ServiceListAPI(Resource):
    @auth_required("token")
    @roles_accepted("admin", "professional", "customer")
    @cache.memoize(timeout = CacheConstants.MEMOIZE_TIMEOUT)
    @marshal_with(service_fields)
    def get(self):
        filterkey = request.args.get('servicecategoryid')
        if filterkey:                        
            services = Service.query.filter(Service.category_id == filterkey).filter(Service.category_id == ServiceCategory.id).all()        
        else:
            services = Service.query.filter(Service.category_id == ServiceCategory.id).all()        
        return services
    
    @auth_required("token")
    @roles_accepted("admin", "professional", "customer")
    @marshal_with(service_fields)
    def post(self):

        args = service_parser.parse_args()
        name = args.get("name", None)
        description = args.get("description", None)
        base_price = args.get("base_price", 0.0)
        time_required = args.get("time_required", 0.0)
        category_id = args.get("category_id", -1)

        servicecategory = ServiceCategory.query.get(category_id)

        if not servicecategory:
             raise BusinessValidationError(status_code=404, error_code="SERVICE-001", error_message="Service Category information not found")
 
        try:
            service = Service(name=name, description=description,base_price=base_price, time_required=time_required, category_id=category_id)
            db.session.add(service)

        except Exception as e:
            db.session.rollback()
            print("Exception: ", e)
        else:
            db.session.commit()

        return service

    
class ServiceSearchAPI(Resource):
    @auth_required("token")
    @roles_accepted("admin", "professional", "customer")
    @marshal_with(service_fields)
    def get(self, search_query):
        search = "%{}%".format(search_query)
        services = Service.query.filter(or_(Service.name.ilike(search), Service.description.ilike(search))).all()
        return services, 200

from flask import current_app as app
from flask_restful import Api, Resource, fields, marshal_with, reqparse
from sqlalchemy import or_
from flask_security import auth_required, roles_accepted
from backend.models import db, ServiceCategory
from backend.utils.constants import CacheConstants
from backend.utils.utilities import Message

cache = app.cache

service_category_fields = {
"id" : fields.Integer,
"name" : fields.String,
"description" : fields.String,
}

service_category_parser = reqparse.RequestParser()
service_category_parser.add_argument("id")
service_category_parser.add_argument("name")
service_category_parser.add_argument("description")

class ServiceCategoryValidate:
    @staticmethod
    def isServiceCategoryValid(service_category_id):
        servicecategory = ServiceCategory.query.get(service_category_id)
        if servicecategory:
            return True
        else:
            return False

class ServiceCategoryAPI(Resource):
    @cache.memoize(timeout = CacheConstants.MEMOIZE_TIMEOUT)
    @marshal_with(service_category_fields)
    def get(self, service_category_id):
        servicecategory = ServiceCategory.query.get(service_category_id)

        if not servicecategory:
            return{"message": "Service Category information not found"}, 404
        
        return servicecategory  
    
class ServiceCategoryListAPI(Resource):
    @cache.cached(timeout = CacheConstants.CACHED_TIMEOUT, key_prefix = "servicecategory_")
    @marshal_with(service_category_fields)
    def get(self):
        servicecategories = ServiceCategory.query.all()

        return servicecategories

    @auth_required("token")
    @marshal_with(service_category_fields)
    def post(self):
        args = service_category_parser.parse_args()
        name = args.get("name", None)
        description = args.get("description", None)
   
        try:
            servicecategory = ServiceCategory(name=name, description=description)
            db.session.add(servicecategory)

        except Exception as e:
            db.session.rollback()
            print("Exception: ", e)
        else:
            db.session.commit()

        return servicecategory


class ServiceCategorySearchAPI(Resource):
    @roles_accepted("admin", "professional", "customer")
    @marshal_with(service_category_fields)
    def get(self, search_query):
        search = "%{}%".format(search_query)
        servicecategories = ServiceCategory.query.filter(or_(ServiceCategory.name.ilike(search), ServiceCategory.description.ilike(search))).all()
        return servicecategories, 200
from datetime import datetime
from flask import request, jsonify, current_app as app
from flask_restful import Api, Resource, fields, marshal_with, reqparse
from sqlalchemy import or_
from flask_security import verify_password, hash_password, auth_required, roles_accepted, current_user
from backend.utils.utilities import *
from backend.models import db, User, Role
from backend.api.servicecategory import ServiceCategoryValidate, service_category_fields


datastore = app.security.datastore

login_fields = {
    "email" : fields.String,
    "password" : fields.String,    
}

login_parser = reqparse.RequestParser()
login_parser.add_argument("email")
login_parser.add_argument("password")

token_fields = {
    "auth_token" : fields.String,
    "id" : fields.Integer,
    "name" : fields.String,
    "email" : fields.String,
    "role" : fields.String,
    
}

token_parser = reqparse.RequestParser()
token_parser.add_argument("auth_token")
token_parser.add_argument("id")
token_parser.add_argument("name")
token_parser.add_argument("email")
token_parser.add_argument("role")

role_fields = {
    "id" : fields.Integer,
    "name" : fields.String,
    "description" : fields.String,
}


user_fields = {
    "id" : fields.Integer,
    "name" : fields.String,
    "email" : fields.String,
    "phone_number" : fields.Integer,
    "area_code" : fields.String,
    "address" : fields.String,
    "created_at" : fields.DateTime,
    "updated_at" : fields.DateTime, 
    "rating" : fields.Float,
    "servicecategory_id" : fields.Integer,
    "experience" : fields.Integer,
    "approval_status" : fields.Boolean,
    "active" : fields.Boolean,
    "roles" : fields.List(fields.Nested(role_fields)),
    "servicecategory" : fields.Nested(service_category_fields)
}

user_basic_fields = {
    "id" : fields.Integer,
    "name" : fields.String,
}

user_parser = reqparse.RequestParser()
user_parser.add_argument("id")
user_parser.add_argument("name")
user_parser.add_argument("email")
user_parser.add_argument("phone_number")
user_parser.add_argument("area_code")
user_parser.add_argument("address")
user_parser.add_argument("created_at")
user_parser.add_argument("updated_at")
user_parser.add_argument("rating")
user_parser.add_argument("servicecategory_id")
user_parser.add_argument("experience")
user_parser.add_argument("approval_status")
user_parser.add_argument("active")
user_parser.add_argument("role")


class LoginAPI(Resource):

    def post(self):
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")        
        
        if not email or not password:
            raise BusinessValidationError(status_code=404, error_code="LOGIN-001", error_message="Invalid inputs")
        
        user = datastore.find_user(email = email)
        if not user:
            raise BusinessValidationError(status_code=404, error_code="LOGIN-002", error_message="Invalid email")
        
        if not verify_password(password, user.password):
            raise BusinessValidationError(status_code=404, error_code="LOGIN-003", error_message="Incorrect password! Please check your credentials!")                            

        if not user.approval_status:
            raise BusinessValidationError(status_code=404, error_code="LOGIN-004", error_message="User blocked or not approved yet. Please contact customer service!")

        if not user.active:
            raise BusinessValidationError(status_code=404, error_code="LOGIN-005", error_message="Account is deactivated. Please contact customer service!")        
                
        return jsonify({"auth_token" : user.get_auth_token(), 
                        "id" : user.id,
                        "name" : user.name,
                        "email" : user.email,
                        "role": user.roles[0].name,
                        })
    
class RegisterAPI(Resource):

    def post(self):
        data = request.get_json()
        name = data.get("name")
        email  = data.get("email")
        password = data.get("password")
        phone_number  = data.get("phone_number")
        area_code  = data.get("area_code")
        address  = data.get("address")
        role  = data.get("role")

        if not name:
            raise BusinessValidationError(status_code=404, error_code="REGISTER-001", error_message="Invalid name!")
        if not email:
            raise BusinessValidationError(status_code=404, error_code="REGISTER-002", error_message="Invalid email!")
        if not password:
            raise BusinessValidationError(status_code=404, error_code="REGISTER-003", error_message="Invalid password!")
        if not phone_number:
            raise BusinessValidationError(status_code=404, error_code="REGISTER-004", error_message="Invalid phone number!")
        if not area_code:
            raise BusinessValidationError(status_code=404, error_code="REGISTER-005", error_message="Invalid area code!")
        if not role or role not in ["admin", "professional", "customer"]:
            raise BusinessValidationError(status_code=404, error_code="REGISTER-006", error_message="Invalid role!")
        
        user = datastore.find_user(email = email)
        if user:
            raise BusinessValidationError(status_code=404, error_code="REGISTER-007", error_message="User already exits!")        
        
        if (role == "professional"):
            servicecategory_id = data.get("servicecategory_id")
            experience = data.get("experience")

            if not ServiceCategoryValidate.isServiceCategoryValid(servicecategory_id):
                raise BusinessValidationError(status_code=404, error_code="REGISTER-008", error_message="Invalid service category!")

            if (int(experience) <= 0):
                raise BusinessValidationError(status_code=404, error_code="REGISTER-009", error_message="Invalid experience!")

        try:
            if (role == "customer"):
                datastore.create_user(name = name,
                                    email = email,
                                    password = hash_password(password), 
                                    phone_number = phone_number,
                                    area_code = area_code,
                                    address = address,
                                    approval_status = True,
                                    roles = [role]
                                    )
            elif (role == "professional"):                                
                datastore.create_user(name = name,
                                    email = email,
                                    password = hash_password(password), 
                                    phone_number = phone_number,
                                    area_code = area_code,
                                    address = address,
                                    servicecategory_id = servicecategory_id,
                                    experience = experience,
                                    approval_status = False,
                                    roles = [role]
                                    )
        except Exception as e:
            db.session.rollback()
            print("Exception: ", e)
            raise BusinessValidationError(status_code=404, error_code="REGISTER-010", error_message="Error creating user!")
        else:
            db.session.commit()

class UserAPI(Resource):
    @auth_required("token")
    @roles_accepted("admin", "professional", "customer")

    @marshal_with(user_fields)
    def get(self, user_id):
        if current_user.roles[0] == "admin" or current_user.id == user_id:
            user = User.query.get(user_id)
        else:
            raise BusinessValidationError(status_code=404, error_code="USER-006", error_message="Not authorized!")

        if not user:
            raise BusinessValidationError(status_code=404, error_code="USER-001", error_message="User not found!")
        return user
    
    @auth_required("token")
    @roles_accepted("admin", "professional", "customer")
    def put(self, user_id):
        user = User.query.get(user_id)

        if not user:
            raise BusinessValidationError(status_code=404, error_code="USER-001", error_message="User not found!")
        
        actionKey = request.args.get('action')
        if not actionKey:
            raise BusinessValidationError(status_code=404, error_code="USER-003", error_message="Invalid inputs!")
        
        try:
            user.updated_at = datetime.now()
            if (actionKey == "approve"):
                user.approval_status = True
            elif ((actionKey == "reject")):
                user.approval_status = False
            elif ((actionKey == "update")):
                data = request.get_json()
                password = data.get("password")
                if password:
                    user.password = hash_password(password)
                user.phone_number = data.get("phone_number")
                user.area_code = data.get("area_code")
                user.address = data.get("address")                 
            else:
                raise BusinessValidationError(status_code=404, error_code="USER-004", error_message="Invalid action parameter!")

        except:
            db.session.rollback()
            raise BusinessValidationError(status_code=404, error_code="USER-005", error_message="Erorr performing requested action!")
        else:
            db.session.commit()

        return Message.getformattedMessage("User action completed!"), 200    

class UserListAPI(Resource):
    @auth_required("token")
    @roles_accepted("admin")
    @marshal_with(user_fields)
    def get(self):

        filterkey = request.args.get('role')

        if filterkey:
            if (filterkey == "admin"):
                raise BusinessValidationError(status_code=404, error_code="USER-002", error_message="Invalid request!")
            users = User.query.join(User.roles).filter(Role.name == filterkey).all()
        else:
            users = User.query.join(User.roles).filter(Role.name != "admin").all()

        return users


class UserSearchAPI(Resource):
    @auth_required('token')
    @roles_accepted("admin")
    @marshal_with(user_fields)
    def get(self, search_query):
        search = "%{}%".format(search_query)
        users = User.query.filter(or_(User.name.ilike(search), User.email.ilike(search), User.phone_number.ilike(search), User.area_code.ilike(search), User.address.ilike(search))).all()
        return users, 200
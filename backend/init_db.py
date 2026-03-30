from flask import current_app as app
from flask_security import SQLAlchemyUserDatastore, hash_password

from .models import *

with app.app_context():
    db.create_all()

    user_datastore : SQLAlchemyUserDatastore = app.security.datastore

    user_datastore.find_or_create_role(name="admin", description = "Administrator")
    user_datastore.find_or_create_role(name="professional", description = "Service Professional")
    user_datastore.find_or_create_role(name="customer", description = "Customer")

    db.session.commit()
    
    if not user_datastore.find_user(email = "admin@hxpert.co"):
        user_datastore.create_user(name = 'System Admin', email = "admin@hxpert.co", password = hash_password("passa"),
                                   phone_number = 9595959595, area_code = "06611", roles = ['admin'],
                                   address="100 Hyderabad Lane", approval_status=True)    
    if not user_datastore.find_user(email = "apranathi@hxpert.co"):
        user_datastore.create_user(name = 'Pranathi Ayyadevara', email = "apranathi@hxpert.co", password = hash_password("passp"),
                                   phone_number = 8585858585, area_code = "06611", roles = ['professional'],
                                   address="200 Delhi Road", approval_status=True, servicecategory_id=1, experience=5)
    if not user_datastore.find_user(email = "tswift@hxpert.co"):
        user_datastore.create_user(name = 'Taylor Swift', email = "tswift@hxpert.co", password = hash_password("passc"),
                                   phone_number = 7575757575, area_code = "06611", roles = ['customer'],
                                   address="300 Chennai Street", approval_status=True)
    db.session.commit()
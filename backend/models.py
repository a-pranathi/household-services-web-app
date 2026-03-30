from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin
from flask_security.models import fsqla_v3 as fsqla

db = SQLAlchemy()

class Role(db.Model, RoleMixin):
    id =  db.Column(db.Integer(), autoincrement = True, primary_key = True)
    name = db.Column(db.String(), unique = True, nullable = False)
    description = db.Column(db.String(), nullable = False)


class User(db.Model, UserMixin):
    id = db.Column(db.Integer(), autoincrement = True, primary_key = True)
    name = db.Column(db.String(), nullable = False)
    email = db.Column(db.String(), unique = True, nullable = False)
    password = db.Column(db.String(), nullable = False)
    phone_number = db.Column(db.Integer(), unique = True, nullable = False)
    area_code = db.Column(db.String(), nullable = False)
    address = db.Column(db.Text(), nullable = False)
    created_at = db.Column(db.DateTime, default=datetime.now, nullable = False)
    updated_at = db.Column(db.DateTime, onupdate=datetime.now)
    rating = db.Column(db.Float())
    servicecategory_id = db.Column(db.Integer, db.ForeignKey('service_category.id'), nullable = True)
    experience = db.Column(db.Integer)
    approval_status = db.Column(db.Boolean)
    active = db.Column(db.Boolean, default = True)
    fs_uniquifier = db.Column(db.String(65), unique = True, nullable = False)    

    roles = db.relationship('Role', secondary='user_roles', backref = 'bearers')
    servicecategory = db.relationship("ServiceCategory")
    customer_bookings = db.relationship("Booking", back_populates="customer", primaryjoin="User.id == Booking.customer_id")
    professional_bookings = db.relationship("Booking", back_populates="professional", primaryjoin="User.id == Booking.professional_id")    

    def get_id(self):
        return (self.id)
    

class UserRoles(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'))

class ServiceCategory(db.Model):
    id = db.Column(db.Integer(), autoincrement = True, primary_key = True)
    name = db.Column(db.String(), nullable = False)
    description = db.Column(db.String(), nullable = False)

    services = db.relationship("Service", back_populates="servicecategory")

class Service(db.Model):
    id = db.Column(db.Integer(), autoincrement = True, primary_key = True)
    name = db.Column(db.String(), nullable = False)
    description = db.Column(db.Text, nullable = False)
    base_price = db.Column(db.Float, nullable=False)
    time_required = db.Column(db.Float, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('service_category.id'), nullable=False)    
    created_at = db.Column(db.DateTime, default=datetime.now, nullable = False)
    updated_at = db.Column(db.DateTime, onupdate=datetime.now)

    servicecategory = db.relationship("ServiceCategory", back_populates="services")
    bookings = db.relationship("Booking", back_populates="service")

class Booking(db.Model):
    id = db.Column(db.Integer(), autoincrement = True, primary_key = True)
    customer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey('service.id'), nullable=False)
    professional_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    booking_date = db.Column(db.DateTime, default=datetime.now, nullable=False)
    service_date = db.Column(db.DateTime)
    status = db.Column(db.String(50), nullable=False)
    remarks = db.Column(db.String)

    customer = db.relationship("User", foreign_keys=[customer_id], back_populates="customer_bookings")
    service = db.relationship("Service", back_populates="bookings")
    professional = db.relationship("User", foreign_keys=[professional_id], back_populates="professional_bookings")
    review = db.relationship("Review", uselist=False, back_populates="booking")      

class Review(db.Model):
    id = db.Column(db.Integer(), autoincrement = True, primary_key = True)
    booking_id = db.Column(db.Integer, db.ForeignKey('booking.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    remarks = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=datetime.now)

    booking = db.relationship("Booking", back_populates="review")
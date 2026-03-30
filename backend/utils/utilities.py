from flask import jsonify
from werkzeug.exceptions import HTTPException
from flask.helpers import make_response
import json

class Message:
    @staticmethod
    def getformattedMessage(text):
        return f"'message': {text}"
    
    @staticmethod
    def getJSONfiyMessage(text):
        return jsonify(Message.getformattedMessage(text))
    
class NotFoundError(HTTPException):
	def __init__(self, status_code):
		self.response = make_response('', status_code)

class InternalServerError(HTTPException):
	def __init__(self, status_code):
		self.response = make_response('', status_code)

class BadRequestError(HTTPException):
	def __init__(self, status_code):
		self.response = make_response('', status_code)

class BusinessValidationError(HTTPException):
	def __init__(self, status_code, error_code, error_message):
		message = {
			"error_code": error_code,
			"error_message": error_message
			}
		self.response = make_response(json.dumps(message), status_code)
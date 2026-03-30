from flask import send_file, make_response
from flask_restful import Resource
from flask_security import auth_required, roles_accepted
from backend.celery.tasks import create_csv
from celery.result import AsyncResult
import os

class CreateFileAPI(Resource):

    @auth_required("token")
    @roles_accepted("admin")
    def get(self, artifact_type):
        task = create_csv.delay(artifact_type)
        return {"task_id": task.id}, 200

class CheckFileStatusAPI(Resource):
    @auth_required("token")
    @roles_accepted("admin")    
    def get(self, task_id):
        result = AsyncResult(task_id)
        if result.ready():
            return {"message": "File is ready for download!"}, 200
        else:
            return {"message": "Task not ready yet!"}, 405

class DownloadFileAPI(Resource):
    def get(self, task_id):
        result = AsyncResult(task_id)
        if result.ready():
            response = make_response(send_file(result.result, as_attachment=True, mimetype='text/csv'))
            response.headers['Content-Disposition'] = f'attachment; filename={os.path.basename(result.result)}' 
            return response
        else:
            return {"message": "Task not ready yet!"}, 405
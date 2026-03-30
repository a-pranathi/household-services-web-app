from flask import Flask
from flask_security import Security, SQLAlchemyUserDatastore
from flask_caching import Cache
from backend.config import *
from backend.models import *
from backend.celery.celery_factory import celery_init_app
import flask_excel as excel

def create_app():
    app = Flask(__name__, template_folder="frontend/templates", static_folder="frontend", static_url_path="/static")
    
    app.config.from_object(LocalDevelopmenConfig())
    db.init_app(app)
    cache = Cache(app)
    
    datastore = SQLAlchemyUserDatastore(db, User, Role)
    app.security = Security(app, datastore = datastore, register_blueprint=False)
    app.cache = cache

    app.app_context().push()
    from backend.api.resources import api
    api.init_app(app)

    return app

app = create_app()
celery_app = celery_init_app(app)

import backend.init_db
import backend.routes
import backend.celery.celery_schedule
excel.init_excel(app)


if __name__ == "__main__":
    #app.run()
    app.run(host="0.0.0.0")
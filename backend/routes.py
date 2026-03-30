from flask import current_app as app, render_template

datastore = app.security.datastore
cache = app.cache

@app.get("/")
def home():
    return render_template("index.html")
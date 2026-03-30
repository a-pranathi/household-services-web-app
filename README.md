# household-services-web-app

Household Services Web App Pranathi Ayyadevara

Application Run Steps:

1. Start Redis:
sudo systemctl start redis-server

2. Start Celery worker:
celery -A app:celery_app worker -l INFO

3. Start Celery beat:
celery -A app:celery_app beat -l INFO

4. Start MailHog:
~/go/bin/MailHog

5. Flask application:
python app.py

Access:

Household services: 
http://127.0.0.1:5000

Mail Service:
http://localhost:8025

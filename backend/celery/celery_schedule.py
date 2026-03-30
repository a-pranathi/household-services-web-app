from celery.schedules import crontab
from flask import current_app as app
from datetime import datetime
from backend.celery.tasks import send_email_task, send_daily_alert, send_monthly_alert
from backend.utils.constants import ScheduleService


celery_app = app.extensions["celery"]

@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):

    sender.add_periodic_task(crontab(hour=ScheduleService.HOUR, minute=ScheduleService.MINUTE),
                             send_daily_alert.s(), name=ScheduleService.DAILY_REMINDERS)
    sender.add_periodic_task(crontab(hour=ScheduleService.HOUR, minute=ScheduleService.MINUTE, day_of_month=ScheduleService.DAY_Of_MONTH), 
                             send_monthly_alert.s(),
                             name=ScheduleService.MONTHLY_REMINDERS)

'''
    Calls test('hello') every 10 seconds.
    sender.add_periodic_task(10.0, test.s('hello'), name='add every 10')

    Calls test('hello') every 30 seconds.
    It uses the same signature of previous task, an explicit name is
    defined to avoid this task replacing the previous one defined.
    sender.add_periodic_task(30.0, test.s('hello'), name='add every 30')

    Calls test('world') every 30 seconds
    sender.add_periodic_task(30.0, test.s('world'), expires=10)

    Executes every Monday morning at 7:30 a.m.
    sender.add_periodic_task(
        crontab(hour=7, minute=30, day_of_week=1),
        test.s('Happy Mondays!'),
            )

    send very 10 seconds
    sender.add_periodic_task(10, send_email_task.s("sender@hss", "Reminder from HSS", "<h1>Hello user reminder!</h1>"))

    send everyday at a particualar time
    sender.add_periodic_task(crontab(hour=17, minute=29), send_email_task.s("sender@hss", subject, content), name="daily reminder")

    send weekly reminder at a particualar time
    sender.add_periodic_task(crontab(hour=17, minute=36, day_of_week=("friday")), send_email_task.s("sender@hss", subject, content), name="weekly reminder")             
'''
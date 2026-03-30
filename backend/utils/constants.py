
class ScheduleService():
    MINUTE = 37
    HOUR = 18
    DAY_OF_WEEK = 1
    DAY_Of_MONTH = 26
    DAILY_REMINDERS = "Daily reminders"
    WEEKLY_REMINDERS = "Weekly reminders"
    MONTHLY_REMINDERS = "Monthly reminders"

class GeneralConfig:
    DOWNLOAD_FILE_LOCATION = "./backend/celery/downloads/{artifact_type}_{task_id}.csv"

class BookingStatus():
    REQUEST = "request"
    CONFIRM = "confirm"
    CLOSE = "close"
    COMPLETE = "complete"

class Mailservice():
    SMTP_SERVER = "localhost"
    SMTP_PORT = 1025
    SENDER_EMAIL = "admin@homexpert.co"
    SENDER_PASSWORD = ""

class CeleryConfig():
    broker_url = "redis://localhost:6379/0"
    result_backend = "redis://localhost:6379/1"
    timezone = "Asia/Kolkata"

class ArtifactType():
    USERS = "users"
    SERVICE_CATEGORIES = "servicecategories"
    SERVICES = "services"
    BOOKINGS = "bookings"
    REVIEWS = "reviews"

class CacheConstants():
    MEMOIZE_TIMEOUT = 5
    CACHED_TIMEOUT = 10
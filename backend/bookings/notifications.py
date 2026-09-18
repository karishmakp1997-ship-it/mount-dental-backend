"""
Sends the two emails a new booking should trigger:
  1. an alert to the clinic (so staff actually know a request came in)
  2. an optional confirmation to the patient (only if they gave an email)

Both are wrapped so a failed email never breaks the booking itself — the
appointment is already saved by the time these run; the patient always sees
"request received" regardless of whether the email goes out.
"""
import logging

from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger(__name__)


def send_appointment_notifications(appointment):
    _send_clinic_alert(appointment)
    if appointment.email:
        _send_patient_confirmation(appointment)


def _send_clinic_alert(appointment):
    to = settings.CLINIC_NOTIFY_EMAIL
    if not to:
        logger.warning("CLINIC_NOTIFY_EMAIL not set — skipping clinic alert email for appointment #%s", appointment.id)
        return

    branch  = appointment.branch.name if appointment.branch else "Not specified"
    service = appointment.service.name if appointment.service else "Not specified"

    subject = f"New appointment request — {appointment.name}"
    body = (
        f"A new appointment request came in from the website.\n\n"
        f"Name: {appointment.name}\n"
        f"Phone: {appointment.phone}\n"
        f"Email: {appointment.email or '-'}\n"
        f"Branch: {branch}\n"
        f"Treatment: {service}\n"
        f"Preferred date: {appointment.preferred_date or 'Not specified'}\n"
        f"Message: {appointment.message or '-'}\n\n"
        f"Manage this booking in the admin under Bookings \u2192 Appointments."
    )
    try:
        send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [to], fail_silently=False)
    except Exception:
        logger.exception("Failed to send clinic alert email for appointment #%s", appointment.id)


def _send_patient_confirmation(appointment):
    branch  = appointment.branch.name if appointment.branch else "Not specified"
    service = appointment.service.name if appointment.service else "Not specified"

    subject = "We've received your appointment request — Mount Dental Care"
    body = (
        f"Hi {appointment.name},\n\n"
        f"Thanks for booking with Mount Dental Care. We've received your request and "
        f"our team will call you shortly to confirm a time.\n\n"
        f"Branch: {branch}\n"
        f"Treatment: {service}\n"
        f"Preferred date: {appointment.preferred_date or 'Not specified'}\n\n"
        f"Need us sooner? Feel free to call the clinic directly.\n\n"
        f"\u2014 Mount Dental Care"
    )
    try:
        send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [appointment.email], fail_silently=False)
    except Exception:
        logger.exception("Failed to send patient confirmation email for appointment #%s", appointment.id)
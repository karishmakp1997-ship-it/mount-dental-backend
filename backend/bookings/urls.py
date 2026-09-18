from django.urls import path

from . import views

urlpatterns = [
    path("appointments/",      views.create_appointment,    name="create-appointment"),
    path("tourism-enquiries/", views.create_tourism_enquiry, name="create-tourism-enquiry"),
]
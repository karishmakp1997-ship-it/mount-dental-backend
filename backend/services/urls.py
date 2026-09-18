from django.urls import path

from . import views

urlpatterns = [
    path("services/",                views.service_list,       name="service-list"),
    path("services/<slug:slug>/",    views.service_detail,     name="service-detail"),
    path("service-categories/",      views.service_categories, name="service-categories"),
    path("smile-cases/",             views.smile_cases,        name="smile-cases"),
]
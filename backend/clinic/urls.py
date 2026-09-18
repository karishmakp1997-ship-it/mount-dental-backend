from django.urls import path

from . import views

urlpatterns = [
    path("home/",                 views.home,          name="home"),
    path("settings/",             views.site_settings, name="site-settings"),
    path("branches/",             views.branch_list,   name="branch-list"),
    path("branches/<slug:slug>/", views.branch_detail, name="branch-detail"),
    path("doctors/",              views.doctor_list,   name="doctor-list"),
]
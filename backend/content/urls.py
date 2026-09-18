from django.urls import path

from . import views

urlpatterns = [
    path("testimonials/", views.testimonial_list, name="testimonial-list"),
    path("awards/",       views.award_list,       name="award-list"),
    path("media/",        views.media_list,       name="media-list"),
    path("gallery/",      views.gallery_list,     name="gallery-list"),
]
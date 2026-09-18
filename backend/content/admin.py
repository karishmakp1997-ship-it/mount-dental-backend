from django.contrib import admin
from unfold.admin import ModelAdmin, TabularInline

from .models import Award, GalleryImage, MediaItem, Testimonial


class GalleryImageInline(TabularInline):
    model  = GalleryImage
    extra  = 1
    fields = ["image", "caption", "order"]


@admin.register(Testimonial)
class TestimonialAdmin(ModelAdmin):
    list_display  = ["patient_name", "treatment", "rating",
                     "patient_consent", "is_published", "order"]
    list_editable = ["order", "is_published"]
    list_filter   = ["rating", "is_published", "patient_consent"]


@admin.register(Award)
class AwardAdmin(ModelAdmin):
    list_display  = ["title", "year", "order"]
    list_editable = ["order"]


@admin.register(MediaItem)
class MediaItemAdmin(ModelAdmin):
    list_display  = ["title", "media_type", "date", "order"]
    list_editable = ["order"]
    list_filter   = ["media_type"]


@admin.register(GalleryImage)
class GalleryImageAdmin(ModelAdmin):
    list_display  = ["__str__", "branch", "order"]
    list_editable = ["order"]
    list_filter   = ["branch"]
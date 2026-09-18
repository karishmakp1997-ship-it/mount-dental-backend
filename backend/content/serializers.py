from rest_framework import serializers

from .models import Award, GalleryImage, MediaItem, Testimonial


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Testimonial
        fields = ["id", "patient_name", "photo", "highlight", "treatment",
                  "review_text", "rating", "video_url", "order"]


class AwardSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Award
        fields = ["id", "title", "image", "year", "description", "order"]


class MediaItemSerializer(serializers.ModelSerializer):
    class Meta:
        model  = MediaItem
        fields = ["id", "title", "media_type", "image",
                  "link", "date", "description", "order"]


class GalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model  = GalleryImage
        fields = ["id", "image", "caption", "order"]
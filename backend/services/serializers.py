from rest_framework import serializers

from .models import Service, ServiceCategory, ServiceFAQ, SmileCase


class ServiceFAQSerializer(serializers.ModelSerializer):
    class Meta:
        model  = ServiceFAQ
        fields = ["question", "answer", "order"]


class SmileCaseSerializer(serializers.ModelSerializer):
    class Meta:
        model  = SmileCase
        fields = ["id", "before_image", "after_image", "duration", "branch"]


class ServiceListSerializer(serializers.ModelSerializer):
    """Lightweight — used for cards and grids."""
    class Meta:
        model  = Service
        fields = ["id", "name", "slug", "icon", "short_desc",
                  "image", "featured_home", "order"]


class ServiceDetailSerializer(serializers.ModelSerializer):
    """Full detail — used for individual service pages."""
    faqs        = ServiceFAQSerializer(many=True, read_only=True)
    smile_cases = SmileCaseSerializer(many=True, read_only=True,
                                       source="smile_cases")

    class Meta:
        model  = Service
        fields = ["id", "name", "slug", "icon", "short_desc", "content",
                  "image", "featured_home", "faqs", "smile_cases",
                  "meta_title", "meta_desc"]


class ServiceCategorySerializer(serializers.ModelSerializer):
    services = ServiceListSerializer(many=True, read_only=True)

    class Meta:
        model  = ServiceCategory
        fields = ["id", "name", "order", "services"]
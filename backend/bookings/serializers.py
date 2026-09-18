from rest_framework import serializers

from .models import Appointment, TourismEnquiry


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Appointment
        fields = ["name", "phone", "email",
                  "branch", "service", "preferred_date", "message"]

    def validate_phone(self, value):
        digits = "".join(filter(str.isdigit, value))
        if len(digits) < 10:
            raise serializers.ValidationError(
                "Please enter a valid 10-digit phone number.")
        return value


class TourismEnquirySerializer(serializers.ModelSerializer):
    class Meta:
        model  = TourismEnquiry
        fields = ["name", "country", "email",
                  "whatsapp", "treatment_interest", "message"]
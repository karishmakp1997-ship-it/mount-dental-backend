from rest_framework import status
from rest_framework.decorators import api_view, throttle_classes
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle


class BookingThrottle(AnonRateThrottle):
    rate = "10/hour"


@api_view(["POST"])
@throttle_classes([BookingThrottle])
def create_appointment(request):
    from .serializers import AppointmentSerializer
    serializer = AppointmentSerializer(data=request.data)
    if serializer.is_valid():
        appointment = serializer.save()
        from .notifications import send_appointment_notifications
        send_appointment_notifications(appointment)
        return Response(
            {"message": "Appointment request received. We will call you to confirm."},
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@throttle_classes([BookingThrottle])
def create_tourism_enquiry(request):
    from .serializers import TourismEnquirySerializer
    serializer = TourismEnquirySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Thank you! We will get in touch with you shortly."},
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
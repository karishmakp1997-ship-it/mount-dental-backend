from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Service, ServiceCategory, SmileCase
from .serializers import (ServiceCategorySerializer, ServiceDetailSerializer,
                           ServiceListSerializer, SmileCaseSerializer)


@api_view(["GET"])
def service_list(request):
    services = Service.objects.filter(is_active=True).select_related("category")
    return Response(ServiceListSerializer(services, many=True,
                                          context={"request": request}).data)


@api_view(["GET"])
def service_detail(request, slug):
    try:
        service = Service.objects.prefetch_related(
            "faqs", "smile_cases", "doctors"
        ).get(slug=slug, is_active=True)
    except Service.DoesNotExist:
        return Response({"detail": "Not found."}, status=404)
    return Response(ServiceDetailSerializer(service,
                                            context={"request": request}).data)


@api_view(["GET"])
def service_categories(request):
    cats = ServiceCategory.objects.prefetch_related("services")
    return Response(ServiceCategorySerializer(cats, many=True,
                                              context={"request": request}).data)


@api_view(["GET"])
def smile_cases(request):
    service_slug = request.query_params.get("service")
    qs = SmileCase.objects.filter(is_active=True, patient_consent=True)
    if service_slug:
        qs = qs.filter(service__slug=service_slug)
    return Response(SmileCaseSerializer(qs, many=True,
                                        context={"request": request}).data)
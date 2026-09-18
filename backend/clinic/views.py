from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Branch, Doctor, HomeFeature, SiteSettings, VisitStep
from .serializers import (BranchSerializer, DoctorCardSerializer, DoctorSerializer,
                          HomeFeatureSerializer, SiteSettingsSerializer, VisitStepSerializer)


@api_view(["GET"])
def home(request):
    """Everything the single-page home needs, in one request."""
    from content.models import Award, MediaItem, Testimonial
    from content.serializers import AwardSerializer, MediaItemSerializer, TestimonialSerializer
    from services.models import Service, SmileCase
    from services.serializers import ServiceListSerializer, SmileCaseSerializer

    ctx = {"request": request}
    site, _ = SiteSettings.objects.get_or_create(pk=1)
    services = Service.objects.filter(is_active=True).select_related("category")
    branches = Branch.objects.filter(is_active=True).prefetch_related("hours")

    doctors = Doctor.objects.filter(is_active=True, featured=True)[:4]
    if not doctors:
        doctors = Doctor.objects.filter(is_active=True)[:4]

    # Before/after cases — every consented, active one (frontend turns this into a carousel;
    # it works the same whether there's 1 case or 20, no code changes needed either side).
    cases = (SmileCase.objects.filter(is_active=True, patient_consent=True)
             .select_related("service", "branch"))
    smile_cases = []
    for case in cases:
        smile_cases.append({
            "id": case.id,
            "service": case.service.name if case.service else "",
            "duration": case.duration,
            "branch": case.branch.name if case.branch else "",
            "before_image": request.build_absolute_uri(case.before_image.url) if case.before_image else None,
            "after_image": request.build_absolute_uri(case.after_image.url) if case.after_image else None,
        })

    # About us: a handful of awards + media items combined into one small strip
    awards = list(AwardSerializer(Award.objects.all()[:3], many=True, context=ctx).data)
    media = list(MediaItemSerializer(MediaItem.objects.all()[:3], many=True, context=ctx).data)
    awards_media = (awards + media)[:6]

    technology = [t.strip() for t in site.technology_list.split("|") if t.strip()]

    testimonials = Testimonial.objects.filter(is_published=True, patient_consent=True)[:6]

    return Response({
        "settings": SiteSettingsSerializer(site, context=ctx).data,
        "features": HomeFeatureSerializer(HomeFeature.objects.filter(is_active=True), many=True).data,
        "steps": VisitStepSerializer(VisitStep.objects.filter(is_active=True), many=True).data,
        "expertise": ServiceListSerializer(services.filter(featured_home=True)[:3], many=True, context=ctx).data,
        "services": ServiceListSerializer(services, many=True, context=ctx).data,
        "services_count": services.count(),
        "smile_cases": smile_cases,
        "doctors": DoctorCardSerializer(doctors, many=True, context=ctx).data,
        "branches": BranchSerializer(branches, many=True, context=ctx).data,
        "testimonials": TestimonialSerializer(testimonials, many=True, context=ctx).data,
        "awards_media": awards_media,
        "technology": technology,
    })


@api_view(["GET"])
def branch_list(request):
    branches = Branch.objects.filter(is_active=True).prefetch_related("hours")
    return Response(BranchSerializer(branches, many=True, context={"request": request}).data)


@api_view(["GET"])
def branch_detail(request, slug):
    try:
        branch = Branch.objects.prefetch_related("hours").get(slug=slug, is_active=True)
    except Branch.DoesNotExist:
        return Response({"detail": "Not found."}, status=404)
    return Response(BranchSerializer(branch, context={"request": request}).data)


@api_view(["GET"])
def doctor_list(request):
    doctors = Doctor.objects.filter(is_active=True).prefetch_related("branches__hours")
    return Response(DoctorSerializer(doctors, many=True, context={"request": request}).data)


@api_view(["GET"])
def site_settings(request):
    site, _ = SiteSettings.objects.get_or_create(pk=1)
    return Response(SiteSettingsSerializer(site, context={"request": request}).data)
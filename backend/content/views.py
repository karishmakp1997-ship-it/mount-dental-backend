from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Award, GalleryImage, MediaItem, Testimonial
from .serializers import (AwardSerializer, GalleryImageSerializer,
                           MediaItemSerializer, TestimonialSerializer)


@api_view(["GET"])
def testimonial_list(request):
    qs = Testimonial.objects.filter(is_published=True, patient_consent=True)
    return Response(TestimonialSerializer(qs, many=True,
                                          context={"request": request}).data)


@api_view(["GET"])
def award_list(request):
    qs = Award.objects.all()
    return Response(AwardSerializer(qs, many=True,
                                    context={"request": request}).data)


@api_view(["GET"])
def media_list(request):
    media_type = request.query_params.get("type")
    qs = MediaItem.objects.all()
    if media_type:
        qs = qs.filter(media_type=media_type)
    return Response(MediaItemSerializer(qs, many=True,
                                        context={"request": request}).data)


@api_view(["GET"])
def gallery_list(request):
    branch_slug = request.query_params.get("branch")
    qs = GalleryImage.objects.select_related("branch").all()
    if branch_slug:
        qs = qs.filter(branch__slug=branch_slug)
    return Response(GalleryImageSerializer(qs, many=True,
                                           context={"request": request}).data)
from django.utils import timezone
from rest_framework import serializers

from .models import DAY_ORDER, Branch, Doctor, HomeFeature, SiteSettings, VisitStep, WorkingHours


def _fmt(t):
    """10:00 -> '10am', 13:30 -> '1:30pm'"""
    hour = t.hour % 12 or 12
    minutes = f":{t.minute:02d}" if t.minute else ""
    return f"{hour}{minutes}{'am' if t.hour < 12 else 'pm'}"


def _sessions_text(h):
    parts = []
    if h.session1_open and h.session1_close:
        parts.append(f"{_fmt(h.session1_open)}–{_fmt(h.session1_close)}")
    if h.session2_open and h.session2_close:
        parts.append(f"{_fmt(h.session2_open)}–{_fmt(h.session2_close)}")
    return " and ".join(parts)


def _sorted_hours(branch):
    return sorted(branch.hours.all(), key=lambda h: DAY_ORDER.index(h.day))


class WorkingHoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkingHours
        fields = ["day", "session1_open", "session1_close",
                  "session2_open", "session2_close", "is_closed"]


class BranchSerializer(serializers.ModelSerializer):
    hours = serializers.SerializerMethodField()
    hours_summary = serializers.SerializerMethodField()
    is_open_now = serializers.SerializerMethodField()

    class Meta:
        model = Branch
        fields = ["id", "name", "slug", "tagline", "address", "phone", "whatsapp", "email",
                  "map_embed", "map_link", "photo", "hours", "hours_summary", "is_open_now"]

    def get_hours(self, obj):
        return WorkingHoursSerializer(_sorted_hours(obj), many=True).data

    def get_hours_summary(self, obj):
        """Groups days with the same timing, e.g. ['Mon–Sat: 10am–1pm and 5pm–9pm', 'Sun: Closed']"""
        groups = []
        for h in _sorted_hours(obj):
            text = "Closed" if h.is_closed else (_sessions_text(h) or "Closed")
            idx = DAY_ORDER.index(h.day)
            if groups and groups[-1]["text"] == text and groups[-1]["end"] == idx - 1:
                groups[-1]["end"] = idx
            else:
                groups.append({"start": idx, "end": idx, "text": text})
        lines = []
        for g in groups:
            days = DAY_ORDER[g["start"]] if g["start"] == g["end"] else f"{DAY_ORDER[g['start']]}–{DAY_ORDER[g['end']]}"
            lines.append(f"{days}: {g['text']}")
        return lines

    def get_is_open_now(self, obj):
        now = timezone.localtime()
        today = DAY_ORDER[now.weekday()]
        current = now.time()
        for h in obj.hours.all():
            if h.day != today or h.is_closed:
                continue
            for open_t, close_t in [(h.session1_open, h.session1_close),
                                    (h.session2_open, h.session2_close)]:
                if open_t and close_t and open_t <= current < close_t:
                    return True
        return False


class DoctorSerializer(serializers.ModelSerializer):
    branches = BranchSerializer(many=True, read_only=True)

    class Meta:
        model = Doctor
        fields = ["id", "name", "slug", "photo", "qualification", "specialization",
                  "experience_years", "bio", "branches", "featured"]


class DoctorCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ["id", "name", "slug", "photo", "specialization", "experience_years"]


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        exclude = ["id"]


class HomeFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeFeature
        fields = ["id", "icon", "title", "description"]


class VisitStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisitStep
        fields = ["id", "icon", "title", "description"]
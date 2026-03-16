from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SkillViewSet, ProjectViewSet, ExperienceViewSet, ContactMessageViewSet

router = DefaultRouter()
router.register('skills', SkillViewSet, basename='skill')
router.register('projects', ProjectViewSet, basename='project')
router.register('experience', ExperienceViewSet, basename='experience')
router.register('contact', ContactMessageViewSet, basename='contact')

urlpatterns = [
    path('', include(router.urls)),
]

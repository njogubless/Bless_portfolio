from django.urls import path
from .views import ProjectListView, MessageCreateView, MessageListView

urlpatterns = [
    path('projects/',  ProjectListView.as_view(),   name='project-list'),
    path('contact/',   MessageCreateView.as_view(),  name='contact'),
    path('messages/',  MessageListView.as_view(),    name='message-list'),
]
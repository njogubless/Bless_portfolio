from django.contrib import admin
from .models import Project, Message

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display  = ['name', 'email', 'subject', 'sent_at', 'is_read']
    list_filter   = ['is_read']
    readonly_fields = ['name', 'email', 'subject', 'body', 'sent_at']
  

admin.site.register(Project)
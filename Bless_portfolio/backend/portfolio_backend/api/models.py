from django.db import models

class Project(models.Model):
    name        = models.CharField(max_length=100)
    tech        = models.CharField(max_length=200)
    description = models.TextField()
    github_url  = models.URLField(blank=True)
    icon        = models.CharField(max_length=10, default='💻')
    color       = models.CharField(max_length=20, default='purple')
    order       = models.IntegerField(default=0)  
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order'] 

    def __str__(self):
        return self.name    
        
class Message(models.Model):
    name       = models.CharField(max_length=100)
    email      = models.EmailField()
    subject    = models.CharField(max_length=200)
    body       = models.TextField()
    sent_at    = models.DateTimeField(auto_now_add=True)
    is_read    = models.BooleanField(default=False)  
    class Meta:
        ordering = ['-sent_at']  

    def __str__(self):
        return f"{self.name} — {self.subject}"
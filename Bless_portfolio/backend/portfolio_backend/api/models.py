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
    

class BlogPost(models.Model):
    CATEGORY_CHOICES = [
        ('mobile',         'Mobile'),
        ('backend',        'Backend'),
        ('infrastructure', 'Infrastructure'),
        ('frontend',       'Frontend'),
        ('career',         'Career'),
    ]

    title      = models.CharField(max_length=200)
    slug       = models.SlugField(unique=True)
    excerpt    = models.TextField()
    content    = models.TextField()
    category   = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    tags       = models.CharField(max_length=200, blank=True)
    cover      = models.URLField(blank=True)
    published  = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    @property
    def reading_time(self):
        words = len(self.content.split())
        minutes = max(1, round(words / 200))
        return f"{minutes} min read"

    @property
    def tags_list(self):
        if not self.tags:
            return []
        return [t.strip() for t in self.tags.split(',')]
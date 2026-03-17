from django.db import models

class Project(models.Model):
    title = models.CharField(max_length=200) # e.g., "Hikers Afrique" [cite: 31]
    description = models.TextField() # e.g., "A cross-platform mobile app..." [cite: 34]
    tech_stack = models.CharField(max_length=500) # "Flutter, Dart, Firebase" [cite: 35, 36]
    link = models.URLField(blank=True) # GitHub link [cite: 32]
    image_url = models.URLField(blank=True)
    order = models.IntegerField(default=0)

    def __str__(self):
        return self.title

class Experience(models.Model):
    company = models.CharField(max_length=100) # e.g., "Ndovu Cloud" [cite: 15]
    role = models.CharField(max_length=100) # e.g., "Backend Engineer" [cite: 16]
    duration = models.CharField(max_length=100) # "May 2023 - Sept 2023" [cite: 18]
    description = models.TextField() # e.g., "Implemented JWT auth..." [cite: 20]

    def __str__(self):
        return f"{self.role} at {self.company}"
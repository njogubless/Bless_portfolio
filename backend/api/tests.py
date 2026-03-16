from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import Skill, Project, Experience, ContactMessage


class SkillAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        Skill.objects.create(name='React.js', category='frontend', level=90)
        Skill.objects.create(name='Django', category='backend', level=88)

    def test_list_skills(self):
        response = self.client.get('/api/skills/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_skill_fields(self):
        response = self.client.get('/api/skills/')
        skill = response.data[0]
        self.assertIn('name', skill)
        self.assertIn('level', skill)
        self.assertIn('category', skill)


class ProjectAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        Project.objects.create(
            title='Test Project',
            description='A test project',
            tech=['React', 'Django'],
            featured=True,
        )
        Project.objects.create(
            title='Another Project',
            description='Another test project',
            tech=['Python'],
            featured=False,
        )

    def test_list_projects(self):
        response = self.client.get('/api/projects/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_featured_projects(self):
        response = self.client.get('/api/projects/featured/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Test Project')


class ExperienceAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        Experience.objects.create(
            role='Developer',
            company='Tech Co',
            period='2023 – Present',
            description='Developed stuff',
            highlights=['Did A', 'Did B'],
        )

    def test_list_experience(self):
        response = self.client.get('/api/experience/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)


class ContactAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_submit_contact_message(self):
        data = {
            'name': 'Jane Doe',
            'email': 'jane@example.com',
            'subject': 'Hello',
            'message': 'I would like to work with you!',
        }
        response = self.client.post('/api/contact/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ContactMessage.objects.count(), 1)
        self.assertEqual(ContactMessage.objects.first().name, 'Jane Doe')

    def test_contact_requires_all_fields(self):
        data = {'name': 'Jane'}
        response = self.client.post('/api/contact/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_contact_get_not_allowed(self):
        response = self.client.get('/api/contact/')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

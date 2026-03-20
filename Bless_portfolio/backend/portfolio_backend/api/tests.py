from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from .models import Project, Message

class ProjectAPITest(TestCase):

    def setUp(self):
      
        self.client = APIClient()
        Project.objects.create(
            name='Test Project',
            tech='Flutter · Firebase',
            description='A test project',
            github_url='https://github.com/test',
            icon='🏔',
            color='purple',
            order=1,
        )

    def test_projects_endpoint_is_public(self):
       
        response = self.client.get('/api/projects/')
        self.assertEqual(response.status_code, 200)

    def test_projects_returns_list(self):
      
        response = self.client.get('/api/projects/')
        self.assertIsInstance(response.data, list)

    def test_projects_returns_correct_fields(self):
    
        response = self.client.get('/api/projects/')
        project = response.data[0]
        self.assertIn('name', project)
        self.assertIn('tech', project)
        self.assertIn('description', project)
        self.assertIn('github_url', project)


class ContactAPITest(TestCase):

    def setUp(self):
        self.client = APIClient()

    def test_contact_endpoint_accepts_post(self):

        response = self.client.post(
            '/api/contact/',
            {
                'name':    'Test User',
                'email':   'test@gmail.com',
                'subject': 'Test Subject',
                'body':    'This is a test message body here',
            },
            format='json'
        )
        self.assertEqual(response.status_code, 201)

    def test_contact_saves_to_database(self):
      
        self.client.post(
            '/api/contact/',
            {
                'name':    'Caleb',
                'email':   'caleb@gmail.com',
                'subject': 'Hello',
                'body':    'Reaching out about a project',
            },
            format='json'
        )
        self.assertEqual(Message.objects.count(), 1)
        self.assertEqual(Message.objects.first().name, 'Caleb')

    def test_contact_rejects_invalid_email(self):
    
        response = self.client.post(
            '/api/contact/',
            {
                'name':    'Test',
                'email':   'not-an-email',
                'subject': 'Test',
                'body':    'Test message body here',
            },
            format='json'
        )
        self.assertEqual(response.status_code, 400)

    def test_messages_endpoint_is_protected(self):
        
        response = self.client.get('/api/messages/')
        self.assertEqual(response.status_code, 401)


class ProjectWriteProtectionTest(TestCase):

    def setUp(self):
        self.client = APIClient()

    def test_cannot_post_project_without_token(self):
       
        response = self.client.post(
            '/api/projects/',
            {
                'name': 'Fake Project',
                'tech': 'React',
                'description': 'Injected project',
                'icon': '💀',
                'color': 'red',
                'order': 99,
            },
            format='json'
        )
        self.assertEqual(response.status_code, 401)
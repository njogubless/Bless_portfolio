<div align="center">

# Paul Njogu — Developer Portfolio

**Flutter & Python Developer · Eldoret, Kenya 🇰🇪**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Django](https://img.shields.io/badge/Django-6.0-092E20?style=flat-square&logo=django)](https://djangoproject.com)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python)](https://python.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

*A full-stack developer portfolio built with React + Django REST Framework*

[Live Site](#) · [Report Bug](https://github.com/njogubless/Bless_portfolio/issues)

</div>

---

## Overview

Personal portfolio website showcasing my work as a Flutter and Python developer.
Built end-to-end — React frontend consuming a live Django REST API backend,
deployed with CI/CD pipelines via GitHub Actions.

The design follows a **Terminal-Glassmorphism** aesthetic — dark background,
frosted glass cards, JetBrains Mono typography, and ambient glow effects.

---

## Screenshots

> _Add screenshots here after deployment_
> `![Home](screenshots/home.png)`

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 + Vite | UI framework and build tool |
| React Router v6 | Client-side routing |
| JetBrains Mono | Terminal-style typography |
| Bricolage Grotesque | Display typography |
| CSS-in-JS (inline styles) | Component styling |

### Backend
| Technology | Purpose |
|------------|---------|
| Django 6.0 | Web framework |
| Django REST Framework | API layer |
| Simple JWT | Authentication |
| PostgreSQL | Production database |
| SQLite | Local development database |
| django-cors-headers | Cross-origin requests |

### Infrastructure
| Technology | Purpose |
|------------|---------|
| GitHub Actions | CI/CD pipelines |
| Docker + Docker Compose | Containerization |
| Vercel | Frontend hosting |
| Render | Backend hosting |
| Cloudflare | DNS + SSL + CDN |

---

## Project Structure
```
Bless_portfolio/
├── .github/
│   └── workflows/
│       ├── frontend.yml      # React CI/CD pipeline
│       └── backend.yml       # Django CI/CD pipeline
│
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Background.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── TerminalCard.jsx
│   │   │   ├── Skills.jsx
│   │   │   ├── Projects.jsx
│   │   │   └── Contact.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Work.jsx
│   │   │   └── Contact.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   └── package.json
│
└── backend/
    └── portfolio_backend/    # Django application
        ├── api/
        │   ├── models.py     # Project + Message models
        │   ├── views.py      # API views
        │   ├── serializers.py
        │   ├── urls.py
        │   ├── admin.py
        │   └── tests.py
        ├── config/
        │   ├── settings.py
        │   └── urls.py
        ├── requirements.txt
        └── manage.py
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/projects/` | Public | List all projects |
| `POST` | `/api/contact/` | Public | Send a contact message |
| `GET` | `/api/messages/` | JWT required | Read inbox (owner only) |
| `POST` | `/api/token/` | — | Login — get JWT tokens |
| `POST` | `/api/token/refresh/` | — | Refresh access token |

### Example — get projects
```bash
curl https://api.paulnjogu.com/api/projects/
```

### Example — send a message
```bash
curl -X POST https://api.paulnjogu.com/api/contact/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "subject": "Collaboration",
    "body": "Hey Paul, I have a project idea..."
  }'
```

### Example — get JWT token
```bash
curl -X POST https://api.paulnjogu.com/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "paul", "password": "yourpassword"}'
```

---

## Local Development

### Prerequisites
- Node.js 20+
- Python 3.11+
- Git

### Frontend setup
```bash
# Clone the repo
git clone https://github.com/njogubless/Bless_portfolio.git
cd Bless_portfolio/frontend

# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:5173
```

### Backend setup
```bash
cd ../backend/portfolio_backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate       # Linux/Mac
# venv\Scripts\activate        # Windows

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start server
python manage.py runserver 8080
# → http://127.0.0.1:8080
```

### Environment variables

Create `backend/portfolio_backend/.env`:
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
DATABASE_URL=           # leave empty for SQLite locally
```

---

## CI/CD Pipeline

Every push to `main` triggers GitHub Actions:
```
Push to main
     ↓
┌────────────────────┐    ┌────────────────────┐
│   Frontend Pipeline│    │   Backend Pipeline │
│                    │    │                    │
│ 1. npm install     │    │ 1. pip install     │
│ 2. npm run build   │    │ 2. django check    │
│ 3. deploy Vercel   │    │ 3. run migrations  │
│                    │    │ 4. run tests       │
│ triggers on:       │    │ 5. deploy Render   │
│ frontend/** changes│    │                    │
└────────────────────┘    │ triggers on:       │
                          │ backend/** changes │
                          └────────────────────┘
```

---

## Running Tests
```bash
cd backend/portfolio_backend
source venv/bin/activate
python manage.py test

# Expected output:
# test_contact_endpoint_accepts_post ... ok
# test_messages_endpoint_is_protected ... ok
# test_projects_endpoint_is_public ... ok
# Ran 3 tests in 0.XXXs — OK
```

---

## Deployment

| Service | Purpose | URL |
|---------|---------|-----|
| Vercel | React frontend | paulnjogu.com |
| Render | Django API | api.paulnjogu.com |
| Cloudflare | DNS + SSL | — |

---

## Author

**Paul Njogu**
- GitHub: [@njogubless](https://github.com/njogubless)
- Email: njogupaul994@gmail.com
- LinkedIn: [Paul Njogu](https://linkedin.com/in/paul-njogu)
- Location: Nairobi, Kenya

---


<div align="center">
  <sub>Built with React + Django · Designed with Terminal-Glassmorphism · Deployed with GitHub Actions</sub>
</div>

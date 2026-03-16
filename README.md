# Bless Njogu — Portfolio

A full-stack personal portfolio built as a **mono-repo** with **React.js** (frontend) and **Django** (backend).

## 🗂 Project Structure

```
Bless_portfolio/
├── frontend/          # React.js + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/    # Navbar, Hero, About, Skills, Projects, Experience, Contact, Footer
│   │   ├── data/          # Static portfolio data (easily swappable with API)
│   │   └── App.jsx
│   ├── index.html
│   └── package.json
│
├── backend/           # Django + Django REST Framework
│   ├── api/           # Models, serializers, views, tests
│   ├── portfolio/     # Project settings & URLs
│   ├── manage.py
│   └── requirements.txt
│
└── README.md
```

## ✨ Features

### Frontend
- ⚛️ **React.js** with **Vite** for lightning-fast dev experience
- 🎨 **Tailwind CSS** with custom design tokens (dark theme, violet accent)
- 🎭 **Framer Motion** animations throughout
- 🔤 **Google Fonts** — Playfair Display (headings) + Inter (body) + JetBrains Mono (code)
- 📱 Fully **responsive** layout
- 🖱️ Smooth scroll, active section detection, mobile hamburger menu
- Sections: Hero, About, Skills, Projects, Experience, Contact

### Backend
- 🐍 **Django 6** with **Django REST Framework**
- 📦 REST API: `/api/skills/`, `/api/projects/`, `/api/experience/`, `/api/contact/`
- 🔒 **CORS** configured for local dev
- 🛠️ Django Admin panel for content management
- 💾 SQLite (dev) — swap for PostgreSQL in production

## 🚀 Getting Started

### Frontend

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data  # populate sample data
python manage.py runserver  # http://localhost:8000
```

## 🌐 API Endpoints

| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| GET    | `/api/skills/`              | List all skills          |
| GET    | `/api/projects/`            | List all projects        |
| GET    | `/api/projects/featured/`   | Featured projects only   |
| GET    | `/api/experience/`          | List experience entries  |
| POST   | `/api/contact/`             | Submit contact message   |
| ANY    | `/admin/`                   | Django admin panel       |

## 🏗️ Tech Stack

| Layer     | Technologies                                          |
|-----------|------------------------------------------------------|
| Frontend  | React.js, Vite, Tailwind CSS, Framer Motion, Axios   |
| Backend   | Django, Django REST Framework, django-cors-headers   |
| Database  | SQLite (dev) / PostgreSQL (prod)                     |
| Fonts     | Playfair Display, Inter, JetBrains Mono              |

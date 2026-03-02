# Real Estate Platform - Monorepo Structure

This project uses a **monorepo** structure with separate frontend and backend applications.

## 📁 Project Structure

```
Real-Estate2/
├── frontend/                    # React Frontend Application
│   ├── src/                     # Source code
│   ├── public/                  # Static assets
│   ├── package.json             # Frontend dependencies
│   ├── vite.config.ts           # Vite configuration
│   ├── tailwind.config.ts       # Tailwind CSS config
│   ├── tsconfig.json            # TypeScript config
│   └── Dockerfile               # Frontend Docker image
│
├── backend/                     # Node.js Backend Server
│   ├── server.js                # Main server file
│   ├── package.json             # Backend dependencies
│   ├── database_schema.sql      # Database schema
│   ├── migrations.sql           # Database migrations
│   └── Dockerfile               # Backend Docker image
│
├── .github/
│   └── workflows/
│       ├── deploy-frontend.yml  # Frontend CI/CD Pipeline
│       ├── deploy-backend.yml   # Backend CI/CD Pipeline
│       └── docker-push.yml      # Legacy (deprecated)
│
├── docker-compose.yml           # Local development setup
└── README.md                    # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- Git

### Local Development

#### Using npm (separate terminals)

**Terminal 1 - Frontend:**
```bash
cd frontend
npm install
npm run dev
# Server runs on http://localhost:8080
```

**Terminal 2 - Backend:**
```bash
cd backend
npm install
npm run dev
# Server runs on http://localhost:3001
```

#### Using Docker Compose (one command)
```bash
docker-compose up --build
```
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## 📦 Building

### Frontend Build
```bash
cd frontend
npm run build
```
Creates optimized production build in `frontend/dist/`

### Backend Build (Docker)
```bash
docker build -t real-estate-backend:latest ./backend
```

### Both Services (Docker)
```bash
docker-compose build
```

## 🔀 CI/CD Pipelines

### Frontend Deployment (`deploy-frontend.yml`)
- **Trigger:** Push to `main` branch with changes in `frontend/**`
- **Steps:**
  1. Checkout code
  2. Build Docker image for frontend
  3. Push to Docker Hub
  4. Tag with `latest` and commit SHA

### Backend Deployment (`deploy-backend.yml`)
- **Trigger:** Push to `main` branch with changes in `backend/**`
- **Steps:**
  1. Checkout code
  2. Build Docker image for backend
  3. Push to Docker Hub
  4. Tag with `latest` and commit SHA

### Required GitHub Secrets
Add these to your GitHub repository settings:
- `DOCKERHUB_USERNAME` - Your Docker Hub username
- `DOCKERHUB_TOKEN` - Your Docker Hub access token

## 📋 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001
```

### Backend (docker-compose.yml or .env)
```env
DB_HOST=216.106.180.123
DB_USER=webdevco_realuser
DB_PASSWORD=adeel@490A
DB_NAME=webdevco_real
JWT_SECRET=aura_home_secret_key_2024
NODE_ENV=production
```

## 🐳 Docker Images

### Frontend Image
- **Base:** `node:20-alpine`
- **Build:** Multi-stage build (npm build → serve)
- **Port:** 3000
- **Size:** ~500MB

### Backend Image
- **Base:** `node:20-alpine`
- **Port:** 3001
- **Size:** ~200MB

## 📝 npm Scripts

### Frontend
```bash
npm run dev       # Start development server (port 8080)
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

### Backend
```bash
npm start         # Start server
npm run dev       # Start with nodemon (auto-reload)
```

## 🔄 Updating Dependencies

### Frontend
```bash
cd frontend
npm update
npm audit fix
```

### Backend
```bash
cd backend
npm update
npm audit fix
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Frontend (8080)
lsof -i :8080
kill -9 <PID>

# Backend (3001)
lsof -i :3001
kill -9 <PID>
```

### Docker Container Issues
```bash
# View logs
docker-compose logs -f frontend
docker-compose logs -f backend

# Rebuild from scratch
docker-compose up --build --force-recreate
```

### Database Connection Issues
- Check `DB_HOST`, `DB_USER`, `DB_PASSWORD` in backend environment
- Ensure database server is running and accessible
- Check database schema is initialized

## 🔐 Security Notes

- Never commit `.env` files with sensitive data
- Use GitHub Secrets for CI/CD credentials
- Rotate database passwords regularly
- Update dependencies monthly

## 📚 Documentation Files

- `docs/IMPLEMENTATION_GUIDE.md` - Setup and implementation
- `docs/EMAIL_VERIFICATION_SETUP.md` - Email configuration
- `docs/PASSWORD_RESET_GUIDE.md` - Password reset flow
- `docs/TESTING_GUIDE.md` - Testing procedures

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Make changes (follow structure of frontend or backend)
3. Commit: `git commit -am "Add feature"`
4. Push: `git push origin feature/name`
5. Create Pull Request

## 📄 License

All rights reserved.

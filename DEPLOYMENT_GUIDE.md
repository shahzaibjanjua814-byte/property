# Deployment Instructions

## Quick Summary

Your Real Estate project now has a **properly organized monorepo structure** with:
- ✅ Separate `frontend/` and `backend/` folders
- ✅ Independent `package.json` files for each
- ✅ Separate Docker images for frontend and backend
- ✅ Separate CI/CD pipelines for independent deployments
- ✅ Health check endpoints for monitoring
- ✅ Docker Compose for local development

## 🚀 Deployment Approaches

### Option 1: Local Development (Easiest)

```bash
# One command to run everything
docker-compose up --build

# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

### Option 2: Cloud Deployment (AWS, GCP, Azure)

1. **Configure GitHub Secrets** (Docker Hub credentials)
2. **Push code to main branch**
3. **GitHub Actions automatically builds and pushes Docker images**
4. **Deploy containers to your cloud platform**

### Option 3: Manual Docker Build & Deploy

```bash
# Build images
docker build -t myrepo/frontend:latest ./frontend
docker build -t myrepo/backend:latest ./backend

# Push to registry
docker push myrepo/frontend:latest
docker push myrepo/backend:latest

# Run on production server
docker pull myrepo/frontend:latest
docker pull myrepo/backend:latest
docker-compose up
```

## 📋 Post-Setup Checklist

- [ ] Read `MONOREPO_STRUCTURE.md` for project overview
- [ ] Read `CI_CD_SETUP.md` for CI/CD configuration
- [ ] Set up GitHub Secrets (`DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`)
- [ ] Test workflows with a test commit
- [ ] Configure environment variables in deployed containers
- [ ] Set up database access on deployed server
- [ ] Configure email credentials for production
- [ ] Test health check endpoints: `GET /health`

## 🔧 Important Files Created

| File | Purpose |
|------|---------|
| `frontend/package.json` | Frontend dependencies only |
| `frontend/Dockerfile` | Frontend Docker build |
| `backend/package.json` | Backend dependencies only |
| `backend/Dockerfile` | Backend Docker build |
| `.github/workflows/deploy-frontend.yml` | Frontend CI/CD |
| `.github/workflows/deploy-backend.yml` | Backend CI/CD |
| `docker-compose.yml` | Local development setup |
| `MONOREPO_STRUCTURE.md` | Project structure guide |
| `docs/CI_CD_SETUP.md` | CI/CD configuration guide |

## 🔄 Development Workflow

### Local Development
```bash
cd frontend && npm install && npm run dev   # Terminal 1
cd backend && npm install && npm run dev    # Terminal 2
```

### Production Deployment
```bash
git commit -am "New feature"
git push origin main
# GitHub Actions automatically builds and deploys!
```

## 📊 Monitoring

### Health Checks
```bash
# Backend health
curl http://localhost:3001/health

# Frontend (via serve)
curl http://localhost:3000
```

### Docker Logs
```bash
docker-compose logs -f frontend
docker-compose logs -f backend
```

### GitHub Actions
- View at: `https://github.com/YOUR_USERNAME/Real-Estate2/actions`

## 🛠️ Customization

### Change Docker Registry
Edit workflows to use AWS ECR, GitHub Container Registry, or custom registry:

```yaml
# In deploy-frontend.yml and deploy-backend.yml
tags: |
  your-registry/real-estate-frontend:latest
```

### Change Ports
Edit `docker-compose.yml`:
```yaml
ports:
  - "YOUR_PORT:3000"  # Change 3000 to your port
```

### Add Database Service
Add to `docker-compose.yml`:
```yaml
postgres:
  image: postgres:15-alpine
  environment:
    POSTGRES_PASSWORD: password
  ports:
    - "5432:5432"
```

## 🆘 Troubleshooting

### Docker Compose Issues
```bash
# Rebuild from scratch
docker-compose down -v
docker-compose up --build

# View logs
docker-compose logs -f

# Clean up
docker-compose down
docker system prune -a
```

### Port Already in Use
```bash
# macOS/Linux
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Permission Denied
```bash
# Linux - add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

## 📚 Key Commands Reference

```bash
# Local Development
docker-compose up                    # Start all services
docker-compose down                  # Stop all services
docker-compose logs -f frontend      # View frontend logs
docker-compose logs -f backend       # View backend logs

# Building
docker build -t myapp:latest ./frontend
docker build -t myapp:latest ./backend

# Pushing
docker login
docker push myrepo/frontend:latest
docker push myrepo/backend:latest

# Production
docker pull myrepo/frontend:latest
docker run -p 3000:3000 myrepo/frontend:latest

# Cleanup
docker system prune -a               # Remove unused images
docker volume prune                  # Remove unused volumes
```

## 🎯 Next Steps

1. **Fork/Clone Repository**
   ```bash
   git clone <your-repo>
   cd Real-Estate2-main
   ```

2. **Set Up GitHub Secrets**
   - Go to Settings → Secrets and variables → Actions
   - Add `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN`

3. **Test Locally**
   ```bash
   docker-compose up --build
   ```

4. **Deploy to Production**
   - Push code to `main` branch
   - Monitor in GitHub Actions tab

## 📞 Support Resources

| Topic | Resource |
|-------|----------|
| Docker | [Docker Docs](https://docs.docker.com/) |
| GitHub Actions | [Actions Documentation](https://docs.github.com/en/actions) |
| Docker Compose | [Compose Docs](https://docs.docker.com/compose/) |
| Vite (Frontend) | [Vite Guide](https://vitejs.dev/) |
| Express (Backend) | [Express Docs](https://expressjs.com/) |

---

**Your project is now ready for professional CI/CD deployment!** 🎉

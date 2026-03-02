# CI/CD Configuration Guide

## Overview

This project uses GitHub Actions to automatically build and deploy Docker images for both frontend and backend when changes are pushed to the `main` branch.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                  GitHub Repository                  │
│                      (main branch)                   │
└──────────┬──────────────────────────┬───────────────┘
           │                          │
           │ Detects changes in:      │ Detects changes in:
           │ frontend/**              │ backend/**
           ↓                          ↓
   ┌──────────────────┐      ┌──────────────────┐
   │deploy-frontend   │      │ deploy-backend   │
   │.yml workflow     │      │ .yml workflow    │
   └──────────────────┘      └──────────────────┘
           │                          │
           ↓                          ↓
   ┌──────────────────┐      ┌──────────────────┐
   │Build Frontend    │      │ Build Backend    │
   │Docker Image      │      │ Docker Image     │
   └──────────────────┘      └──────────────────┘
           │                          │
           ↓                          ↓
   ┌──────────────────┐      ┌──────────────────┐
   │Push to Docker    │      │ Push to Docker   │
   │Hub               │      │ Hub              │
   └──────────────────┘      └──────────────────┘
           │                          │
           ↓                          ↓
   frontend:latest              backend:latest
   frontend:${SHA}              backend:${SHA}
```

## Setup Instructions

### Step 1: Create Docker Hub Account

1. Go to [Docker Hub](https://hub.docker.com)
2. Sign up for a free account
3. Create a Personal Access Token:
   - Click your profile icon → Account Settings
   - Left sidebar → Security → New Access Token
   - Give it a descriptive name
   - Copy the token

### Step 2: Add GitHub Secrets

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add the following secrets:

| Secret Name | Value |
|---|---|
| `DOCKERHUB_USERNAME` | Your Docker Hub username |
| `DOCKERHUB_TOKEN` | Your Docker Hub access token |

### Step 3: Verify Workflows

1. Check `.github/workflows/` directory contains:
   - `deploy-frontend.yml`
   - `deploy-backend.yml`

2. Each workflow is configured to trigger on:
   - Push to `main` branch
   - Changes in respective directories (`frontend/**` or `backend/**`)

## Workflow Details

### Deploy Frontend Workflow

**File:** `.github/workflows/deploy-frontend.yml`

**Triggers on:**
- Push to `main` branch
- Changes in `frontend/` folder

**What it does:**
1. Checks out repository code
2. Sets up Docker Buildx
3. Authenticates with Docker Hub
4. Builds frontend Docker image
5. Pushes to Docker Hub with tags:
   - `username/real-estate-frontend:latest`
   - `username/real-estate-frontend:${GITHUB_SHA}`

### Deploy Backend Workflow

**File:** `.github/workflows/deploy-backend.yml`

**Triggers on:**
- Push to `main` branch
- Changes in `backend/` folder

**What it does:**
1. Checks out repository code
2. Sets up Docker Buildx
3. Authenticates with Docker Hub
4. Builds backend Docker image
5. Pushes to Docker Hub with tags:
   - `username/real-estate-backend:latest`
   - `username/real-estate-backend:${GITHUB_SHA}`

## Testing Workflows Locally

### Using Act (GitHub Actions Local Testing)

Install `act`: https://github.com/nektos/act

```bash
# Run frontend deployment locally
act -j build-and-push-frontend

# Run backend deployment locally
act -j build-and-push-backend
```

### Manual Docker Build

```bash
# Build frontend image
docker build -t real-estate-frontend:latest ./frontend

# Build backend image
docker build -t real-estate-backend:latest ./backend

# Tag for Docker Hub
docker tag real-estate-frontend:latest username/real-estate-frontend:latest
docker tag real-estate-backend:latest username/real-estate-backend:latest

# Push to Docker Hub (requires login)
docker login
docker push username/real-estate-frontend:latest
docker push username/real-estate-backend:latest
```

## Understanding the Workflows

### Workflow Syntax Breakdown

```yaml
# Trigger on push to main branch only if these files changed
on:
  push:
    branches:
      - main
    paths:
      - 'frontend/**'      # Only frontend changes
      - '.github/workflows/deploy-frontend.yml'

# Define jobs to run
jobs:
  build-and-push-frontend:  # Job name
    runs-on: ubuntu-latest  # GitHub hosted runner OS
    
    steps:
      - uses: actions/checkout@v4  # Action from marketplace
      - run: echo "Running commands"  # Run shell commands
```

## Monitoring Deployments

### GitHub Actions Dashboard

1. Go to your repository
2. Click "Actions" tab
3. View workflow runs
4. Click on a run to see detailed logs

### Docker Hub Dashboard

1. Log in to Docker Hub
2. Go to your repositories
3. Click on `real-estate-frontend` or `real-estate-backend`
4. View image tags and build history

## Troubleshooting

### Workflow Not Triggering

**Issue:** Workflow doesn't run when you push changes

**Solutions:**
- Verify you pushed to `main` branch: `git branch -a`
- Check you modified files in `frontend/` or `backend/` folders
- Review `.github/workflows/` files for correct branch name
- Go to Actions tab and check for errors

### Docker Push Fails

**Issue:** "unauthorized: authentication required"

**Solutions:**
```bash
# Verify Docker Hub credentials locally
docker login

# Check secret values in GitHub (they're masked for security)
# Re-create secrets if needed
```

### Build Fails

**Issue:** Docker build fails with missing dependencies

**Solutions:**
- Check `Dockerfile` for correct base image
- Verify `package.json` exists in frontend/backend
- Review error logs in GitHub Actions

```bash
# Test build locally
docker build -t test:latest ./frontend
docker build -t test:latest ./backend
```

## Image Tagging Strategy

### Latest Tag
- Points to most recent production deployment
- Use for production deployments

### SHA Tag
- Points to specific commit
- Useful for rollbacks and debugging
- Format: `username/real-estate-backend:a1b2c3d`

### Example Usage
```bash
# Pull latest
docker pull username/real-estate-frontend:latest

# Pull specific version
docker pull username/real-estate-frontend:a1b2c3d

# Run container
docker run -p 3000:3000 username/real-estate-frontend:latest
```

## Security Best Practices

1. **Rotate Tokens Regularly**
   - Update Docker Hub token every 3-6 months
   - Update GitHub secrets accordingly

2. **Use Read-Only Tokens When Possible**
   - Restrict token permissions to images only

3. **Monitor Workflow Runs**
   - Regularly check GitHub Actions for suspicious activity

4. **Environment Variables**
   - Never commit `.env` files
   - Use `.env.example` for templates
   - Store secrets in GitHub Secrets, not in code

5. **Image Security**
   - Regularly scan images for vulnerabilities
   - Keep base images updated
   - Use specific version tags (not just `latest`)

## Advanced Configuration

### Deploy to Kubernetes

Update workflow to deploy to Kubernetes:

```yaml
- name: Deploy to Kubernetes
  run: |
    kubectl set image deployment/frontend \
      frontend=username/real-estate-frontend:${{ github.sha }}
```

### Deploy to AWS ECR

Update workflow to use AWS ECR instead of Docker Hub:

```yaml
- name: Login to Amazon ECR
  uses: aws-actions/amazon-ecr-login@v1
  
- name: Push to ECR
  run: |
    docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
```

### Add Tests Before Build

```yaml
- name: Run Tests
  run: |
    cd frontend
    npm install
    npm run test
```

## Next Steps

1. Configure GitHub Secrets
2. Test workflows with a test push
3. Monitor first deployments
4. Set up automated rollback strategy
5. Document deployment procedures for team

## Support

For issues or questions:
- Check GitHub Actions logs
- Review Docker Hub build history
- Consult workflow files in `.github/workflows/`

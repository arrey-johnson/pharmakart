# 🐳 PharmaKart Docker Deployment Guide

## 📋 Prerequisites

1. **Docker installed** - https://docs.docker.com/get-docker/
2. **Docker Hub account** - https://hub.docker.com/signup
3. **Docker Compose installed** (usually comes with Docker Desktop)

---

## 🚀 Quick Start - Local Development

### 1. Build and Run with Docker Compose

```bash
# From project root
docker-compose up -d
```

**This will:**
- ✅ Build backend Docker image
- ✅ Pull MySQL 8.0 image
- ✅ Create network for services
- ✅ Start backend on http://localhost:3001
- ✅ Start MySQL on localhost:3306

### 2. Check Status

```bash
docker-compose ps
```

### 3. View Logs

```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# MySQL only
docker-compose logs -f mysql
```

### 4. Stop Services

```bash
docker-compose down
```

---

## 📦 Build and Push to Docker Hub

### Step 1: Login to Docker Hub

```bash
docker login
# Enter your Docker Hub username and password
```

### Step 2: Build Backend Image

```bash
cd backend
docker build -t your-dockerhub-username/pharmakart-backend:latest .
cd ..
```

**Replace `your-dockerhub-username` with your actual Docker Hub username!**

### Step 3: Tag Image (Optional - for versioning)

```bash
# Tag with version
docker tag your-dockerhub-username/pharmakart-backend:latest \
           your-dockerhub-username/pharmakart-backend:v1.0.0
```

### Step 4: Push to Docker Hub

```bash
# Push latest
docker push your-dockerhub-username/pharmakart-backend:latest

# Push version (if tagged)
docker push your-dockerhub-username/pharmakart-backend:v1.0.0
```

### Step 5: Verify on Docker Hub

1. Go to https://hub.docker.com
2. Navigate to your repositories
3. You should see `pharmakart-backend`

---

## 🌍 Deploy to Production Server

### Option 1: Using docker-compose.prod.yml

#### 1. Create .env.docker file on server

```bash
# Copy example file
cp .env.docker.example .env.docker

# Edit with your values
nano .env.docker
```

**Set these values:**
```env
DOCKER_USERNAME=your-dockerhub-username
MYSQL_ROOT_PASSWORD=strong-root-password-here
MYSQL_DATABASE=pharmakart
MYSQL_USER=pharmakart_user
MYSQL_PASSWORD=strong-user-password-here
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
NODE_ENV=production
```

#### 2. Pull and Run

```bash
# Pull latest image from Docker Hub
docker-compose -f docker-compose.prod.yml --env-file .env.docker pull

# Start services
docker-compose -f docker-compose.prod.yml --env-file .env.docker up -d
```

#### 3. Check Status

```bash
docker-compose -f docker-compose.prod.yml ps
```

---

### Option 2: Manual Docker Run Commands

#### 1. Create Network

```bash
docker network create pharmakart-network
```

#### 2. Run MySQL

```bash
docker run -d \
  --name pharmakart-mysql \
  --network pharmakart-network \
  -e MYSQL_ROOT_PASSWORD=your-root-password \
  -e MYSQL_DATABASE=pharmakart \
  -e MYSQL_USER=pharmakart_user \
  -e MYSQL_PASSWORD=your-user-password \
  -v mysql_data:/var/lib/mysql \
  -p 3306:3306 \
  mysql:8.0
```

#### 3. Run Backend

```bash
docker run -d \
  --name pharmakart-backend \
  --network pharmakart-network \
  -e NODE_ENV=production \
  -e PORT=3001 \
  -e DB_HOST=pharmakart-mysql \
  -e DB_PORT=3306 \
  -e DB_USER=pharmakart_user \
  -e DB_PASSWORD=your-user-password \
  -e DB_NAME=pharmakart \
  -e JWT_SECRET=your-jwt-secret \
  -p 3001:3001 \
  your-dockerhub-username/pharmakart-backend:latest
```

---

## 🔄 Update Deployment

### When you make code changes:

#### 1. Rebuild and Push

```bash
cd backend
docker build -t your-dockerhub-username/pharmakart-backend:latest .
docker push your-dockerhub-username/pharmakart-backend:latest
cd ..
```

#### 2. Update Production

```bash
# Pull latest image
docker-compose -f docker-compose.prod.yml pull backend

# Restart backend service
docker-compose -f docker-compose.prod.yml up -d backend
```

---

## 📱 Update Mobile App API URL

After deploying to a server, update mobile app:

**File:** `mobile-ionic/src/services/api.ts`

```typescript
// Use your server's IP or domain
export const API_BASE_URL = 'http://your-server-ip:3001/api';
// Or with domain:
// export const API_BASE_URL = 'https://api.pharmakart.com/api';
```

Then rebuild mobile app:
```bash
cd mobile-ionic
npm run build
```

---

## 🛠️ Useful Docker Commands

### View Running Containers
```bash
docker ps
```

### View All Containers (including stopped)
```bash
docker ps -a
```

### View Logs
```bash
docker logs pharmakart-backend
docker logs pharmakart-mysql
```

### Follow Logs (live)
```bash
docker logs -f pharmakart-backend
```

### Execute Commands in Container
```bash
# Access backend shell
docker exec -it pharmakart-backend sh

# Access MySQL shell
docker exec -it pharmakart-mysql mysql -u pharmakart_user -p
```

### Stop Containers
```bash
docker stop pharmakart-backend pharmakart-mysql
```

### Remove Containers
```bash
docker rm pharmakart-backend pharmakart-mysql
```

### Remove Images
```bash
docker rmi your-dockerhub-username/pharmakart-backend:latest
```

### View Images
```bash
docker images
```

### Clean Up Unused Resources
```bash
# Remove unused containers, networks, images
docker system prune -a
```

---

## 🔒 Security Best Practices

### 1. Environment Variables
- ✅ Never commit `.env.docker` to git
- ✅ Use strong passwords (min 16 characters)
- ✅ Generate random JWT secret (min 32 characters)

### 2. Database Security
- ✅ Don't expose MySQL port in production (remove `ports:` from mysql service)
- ✅ Use non-root user for backend connection
- ✅ Enable SSL for MySQL connections

### 3. Network Security
- ✅ Use internal Docker networks
- ✅ Only expose necessary ports
- ✅ Use reverse proxy (Nginx) for HTTPS

### 4. Image Security
- ✅ Use official base images
- ✅ Keep images updated
- ✅ Scan for vulnerabilities: `docker scan your-image`

---

## 📊 Deployment Platforms

### Where to Deploy Your Docker Containers:

1. **DigitalOcean App Platform**
   - Easy Docker deployment
   - $5/month droplet
   - Student credits available

2. **AWS ECS/Fargate**
   - Scalable
   - Pay per use
   - Free tier available

3. **Google Cloud Run**
   - Serverless containers
   - Pay per request
   - Free tier generous

4. **Azure Container Instances**
   - Simple deployment
   - Pay per second
   - Student credits available

5. **Heroku Container Registry**
   - Easy deployment
   - Good for small apps
   - No free tier anymore

6. **Railway.app**
   - Can deploy Docker images
   - $5/month credit
   - Very easy

7. **Render.com**
   - Docker support
   - Free tier available
   - Auto-deploy from Docker Hub

---

## 🐛 Troubleshooting

### Backend Can't Connect to Database

```bash
# Check if MySQL is ready
docker logs pharmakart-mysql

# Check network
docker network inspect pharmakart-network

# Verify environment variables
docker exec pharmakart-backend env
```

### Port Already in Use

```bash
# Find process using port 3001
netstat -ano | findstr :3001  # Windows
lsof -i :3001                  # Mac/Linux

# Stop the process or change port in docker-compose.yml
```

### Container Keeps Restarting

```bash
# Check logs
docker logs pharmakart-backend

# Common issues:
# - Database not ready (wait for healthcheck)
# - Wrong environment variables
# - Port conflicts
```

### Image Build Fails

```bash
# Clear Docker cache
docker builder prune

# Rebuild without cache
docker build --no-cache -t your-image .
```

---

## 📈 Monitoring

### Health Checks

```bash
# Check backend health
curl http://localhost:3001/api

# Check MySQL health
docker exec pharmakart-mysql mysqladmin ping -h localhost -u root -p
```

### Resource Usage

```bash
# View resource usage
docker stats

# View specific container
docker stats pharmakart-backend
```

---

## 🎯 Production Checklist

- [ ] Built Docker image successfully
- [ ] Pushed to Docker Hub
- [ ] Created .env.docker with strong passwords
- [ ] Tested locally with docker-compose
- [ ] Deployed to production server
- [ ] Backend is accessible
- [ ] Database is connected
- [ ] Updated mobile app API URL
- [ ] Tested all endpoints
- [ ] Set up backups
- [ ] Configured monitoring
- [ ] Documented server details

---

## 📚 Additional Resources

- **Docker Docs:** https://docs.docker.com
- **Docker Hub:** https://hub.docker.com
- **Docker Compose:** https://docs.docker.com/compose/
- **NestJS Docker:** https://docs.nestjs.com/recipes/deployment#docker
- **MySQL Docker:** https://hub.docker.com/_/mysql

---

**Your PharmaKart backend is now Dockerized and ready for deployment anywhere! 🐳🚀**


# 🐳 Docker Quick Start - PharmaKart

## ⚡ 3 Steps to Docker Hub

### 1️⃣ Build Image
```bash
cd backend
docker build -t YOUR-USERNAME/pharmakart-backend:latest .
```

### 2️⃣ Login & Push
```bash
docker login
docker push YOUR-USERNAME/pharmakart-backend:latest
```

### 3️⃣ Deploy Anywhere!
```bash
docker pull YOUR-USERNAME/pharmakart-backend:latest
docker-compose up -d
```

---

## 🏃 Local Testing (Before Push)

```bash
# From project root
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

**Backend:** http://localhost:3001/api  
**MySQL:** localhost:3306

---

## 📦 Your Docker Hub Image

After pushing, your image will be public at:
```
https://hub.docker.com/r/YOUR-USERNAME/pharmakart-backend
```

Anyone can pull it:
```bash
docker pull YOUR-USERNAME/pharmakart-backend:latest
```

---

## 🌍 Deploy to Server

1. **SSH to server**
2. **Copy docker-compose.prod.yml**
3. **Create .env.docker**
4. **Run:**
```bash
docker-compose -f docker-compose.prod.yml --env-file .env.docker up -d
```

---

## 🔄 Update After Changes

```bash
# 1. Rebuild
cd backend
docker build -t YOUR-USERNAME/pharmakart-backend:latest .

# 2. Push
docker push YOUR-USERNAME/pharmakart-backend:latest

# 3. Pull on server
docker-compose pull backend
docker-compose up -d backend
```

---

## ✅ Quick Commands

| Command | Description |
|---------|-------------|
| `docker ps` | List running containers |
| `docker logs CONTAINER` | View logs |
| `docker exec -it CONTAINER sh` | Access shell |
| `docker-compose up -d` | Start in background |
| `docker-compose down` | Stop all |
| `docker images` | List images |

---

**Full Guide:** See `DOCKER_DEPLOYMENT.md`

**Ready to dockerize? Replace YOUR-USERNAME and run the commands!** 🚀


# 🚀 PharmaKart Backend Hosting - Quick Start

## ⚡ Fastest Way: Railway.app (5 minutes)

### 1️⃣ Sign Up
- Go to https://railway.app
- Click "Login with GitHub"
- Authorize Railway

### 2️⃣ Create Project
```
1. Dashboard → "New Project"
2. "Deploy from GitHub repo"
3. Select: pharmakart repository
4. Select: backend folder
```

### 3️⃣ Add MySQL Database
```
1. In project → "New" → "Database" → "MySQL"
2. Click MySQL service → Copy credentials
```

### 4️⃣ Configure Backend
```
1. Click backend service
2. Settings → Root Directory: backend
3. Variables → Add Reference → Select MySQL
4. Add JWT_SECRET variable
```

### 5️⃣ Deploy
```
Railway auto-deploys!
Wait 2-3 minutes for first build.
```

### 6️⃣ Get Your URL
```
Settings → Networking → Generate Domain
Copy: https://your-app.up.railway.app
```

---

## 📱 Update Mobile App

### File: `mobile-ionic/src/services/api.ts`

**Before:**
```typescript
export const API_BASE_URL = 'http://192.168.1.251:3001/api';
```

**After:**
```typescript
export const API_BASE_URL = 'https://your-app.up.railway.app/api';
```

### Rebuild Mobile App:
```bash
cd mobile-ionic
npm run build
```

---

## ✅ Test Your Deployed Backend

### In Browser:
```
https://your-app.up.railway.app/api
```

### Test Medicines Endpoint:
```
https://your-app.up.railway.app/api/medicines/available
```

### Test Login (Postman/Insomnia):
```json
POST https://your-app.up.railway.app/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

---

## 🎯 You're Done!

Your backend is now:
- ✅ Hosted online
- ✅ Accessible from anywhere
- ✅ Running 24/7
- ✅ Using cloud MySQL database
- ✅ HTTPS enabled

### Mobile App Can Now:
- ✅ Access from any device
- ✅ No need for local backend
- ✅ Share with others
- ✅ Test on real devices

---

## 💡 Pro Tips

1. **Free Tier Limits:**
   - Railway: $5 credit/month (enough for hobby project)
   - Render: Free tier has cold starts

2. **Database Backups:**
   - Railway: Settings → Enable backups
   - Export regularly for safety

3. **Monitor Usage:**
   - Railway dashboard shows credit usage
   - Set up alerts for high usage

4. **Environment Variables:**
   - Keep JWT_SECRET safe
   - Use different secrets for prod/dev

---

## 🆘 Need Help?

### Check Logs:
```
Railway: Service → Logs tab
Render: Service → Logs
```

### Common Issues:
- ❌ Build fails → Check package.json scripts
- ❌ Database error → Verify credentials
- ❌ 502 error → Check PORT variable
- ❌ CORS error → Update CORS settings in backend

---

## 📚 Full Guide

See `backend/DEPLOYMENT.md` for detailed instructions.

---

**Ready to deploy? Let's go! 🚀**


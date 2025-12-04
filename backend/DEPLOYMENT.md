# 🚀 PharmaKart Backend Deployment Guide

## Option 1: Deploy to Railway.app (Recommended)

### Step 1: Sign Up for Railway
1. Go to https://railway.app
2. Sign up with GitHub (easiest)
3. You get **$5 free credit per month**

### Step 2: Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Connect your GitHub account
4. Select your `pharmakart` repository

### Step 3: Add MySQL Database
1. In your project, click **"New"** → **"Database"** → **"Add MySQL"**
2. Railway will automatically create a MySQL database
3. Click on the MySQL service to see connection details

### Step 4: Configure Backend Service
1. Click on your backend service
2. Go to **"Settings"** → **"Root Directory"**
3. Set to: `backend`
4. Click **"Variables"** tab
5. Add these environment variables:

```env
NODE_ENV=production
PORT=3001

# Database (Railway provides these automatically if you link the MySQL service)
DB_HOST=${MYSQLHOST}
DB_PORT=${MYSQLPORT}
DB_USER=${MYSQLUSER}
DB_PASSWORD=${MYSQLPASSWORD}
DB_NAME=${MYSQLDATABASE}

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### Step 5: Link Database to Backend
1. Click on your backend service
2. Click **"Variables"** tab
3. Click **"Add Reference"**
4. Select your MySQL database
5. This automatically adds database connection variables

### Step 6: Deploy
1. Railway will automatically deploy when you push to GitHub
2. Or click **"Deploy"** manually
3. Wait for build to complete (2-5 minutes)

### Step 7: Get Your Backend URL
1. Go to **"Settings"** → **"Networking"**
2. Click **"Generate Domain"**
3. Copy your URL: `https://your-app-name.up.railway.app`

### Step 8: Test Your Backend
```bash
# Test health endpoint
curl https://your-app-name.up.railway.app/api

# Test with Postman or browser
https://your-app-name.up.railway.app/api/medicines
```

---

## Option 2: Deploy to Render.com (Free Alternative)

### Step 1: Sign Up
1. Go to https://render.com
2. Sign up with GitHub

### Step 2: Create MySQL Database
1. Dashboard → **"New +"** → **"PostgreSQL"** (Free tier)
2. Or use external MySQL provider like PlanetScale

### Step 3: Create Web Service
1. Dashboard → **"New +"** → **"Web Service"**
2. Connect your GitHub repo
3. Settings:
   - **Name:** pharmakart-backend
   - **Root Directory:** backend
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start:prod`

### Step 4: Environment Variables
Add in Render dashboard:
```env
NODE_ENV=production
PORT=3001
DB_HOST=your-db-host
DB_PORT=3306
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=pharmakart
JWT_SECRET=your-jwt-secret
```

### Step 5: Deploy
- Render auto-deploys on git push
- Free tier has cold starts (app sleeps after inactivity)

---

## 📱 Update Mobile App to Use Hosted Backend

### Update API URL in Mobile App:

**File:** `mobile-ionic/src/services/api.ts`

```typescript
// Replace localhost with your Railway/Render URL
export const API_BASE_URL = 'https://your-app-name.up.railway.app/api';
```

**File:** `src/lib/api-client.ts` (Web App)

```typescript
const baseURL = process.env.NODE_ENV === 'production' 
  ? 'https://your-app-name.up.railway.app/api'
  : 'http://localhost:3001/api';
```

---

## 🔒 Security Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Enable HTTPS (Railway/Render provide this automatically)
- [ ] Update CORS to allow only your frontend domains
- [ ] Use environment variables for all secrets
- [ ] Enable database backups (Railway/Render settings)

---

## 📊 Monitor Your App

### Railway:
- View logs: Click service → **"Logs"** tab
- View metrics: **"Metrics"** tab
- Cost: **"Usage"** tab

### Render:
- Logs: Service → **"Logs"** tab
- Metrics: **"Metrics"** tab

---

## 🐛 Troubleshooting

### Build Fails:
```bash
# Check logs in Railway/Render dashboard
# Common issues:
- Missing dependencies in package.json
- TypeScript errors
- Database connection issues
```

### Database Connection Fails:
```bash
# Verify environment variables
# Check database service is running
# Verify database credentials
```

### App Crashes:
```bash
# Check logs for error messages
# Verify PORT environment variable
# Check database migrations ran successfully
```

---

## 🎯 Next Steps

1. Set up automatic database backups
2. Configure custom domain (optional)
3. Set up monitoring/alerts
4. Configure CI/CD for auto-deployment
5. Add staging environment

---

## 💰 Cost Estimates

### Railway (Recommended):
- **Free Tier:** $5 credit/month
- **Backend + MySQL:** ~$3-4/month
- **Hobby Plan:** $5/month (no credit card needed for hobby plan)

### Render:
- **Free Tier:** Free forever
- **Limitations:** Cold starts, 750 hours/month
- **Paid:** $7/month (no cold starts)

---

## 📚 Additional Resources

- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs
- NestJS Production: https://docs.nestjs.com/techniques/production
- Database Migrations: https://typeorm.io/migrations

---

**Need Help?** Open an issue or contact support on the respective platforms!


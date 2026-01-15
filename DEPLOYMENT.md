# Deployment Guide

Deploy your website for **free** using GitHub Pages (frontend) and Render (backend + database).

## Prerequisites

- GitHub account (free)
- Render account (free tier available at [render.com](https://render.com))

---

## Step 1: Deploy Backend to Render (5 minutes)

### 1.1 Create a Render Account
1. Go to [render.com](https://render.com) and sign up (free)
2. Connect your GitHub account (click "GitHub" button)

### 1.2 Deploy from render.yaml
1. In Render dashboard, click **"New +"** → **"Blueprint"**
2. Connect your GitHub repository
3. Render will automatically detect `render.yaml` and deploy:
   - Go backend service
   - PostgreSQL database
4. Wait 2-3 minutes for deployment to complete
5. Copy the backend URL from Render (looks like: `https://testwebsite-backend.onrender.com`)

### 1.3 Set Backend URL in GitHub Secrets
1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. Create:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://testwebsite-backend.onrender.com/api` (replace with your actual URL)
4. Save

---

## Step 2: Enable GitHub Pages (2 minutes)

1. Go to your repo → **Settings** → **Pages**
2. Under "Source", select **Deploy from a branch**
3. Branch: **gh-pages**
4. Save
5. Wait 1-2 minutes for deployment

---

## Step 3: Trigger Frontend Deployment (1 minute)

The GitHub Actions workflow automatically deploys when you push to `main`.

To deploy now:
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

Watch deployment progress:
1. Go to your repo → **Actions**
2. Click the latest workflow
3. Wait for "Deploy to GitHub Pages" to complete (green checkmark)

---

## Step 4: Access Your Website

- **Frontend**: `https://jakeito.github.io/TestWebsite`
- **Backend API**: `https://testwebsite-backend.onrender.com/api`
- **Admin Panel**: `https://jakeito.github.io/TestWebsite/admin`

---

## Important Notes

### Free Tier Limitations

**Render.com (Backend)**
- Free tier includes 750 hours/month (enough for always-on)
- Database spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- No credit card required (but recommended for production)

**GitHub Pages**
- Completely free with unlimited bandwidth
- No spin-down, always available
- Ideal for static React apps

### Environment Variables

The frontend uses this environment variable for production:
```
VITE_API_URL=https://testwebsite-backend.onrender.com/api
```

Change this in **GitHub Secrets** if you deploy to a different backend.

### Admin Login

Default credentials (change in Render environment variables):
- **Email**: `admin@example.com`
- **Password**: `changeme` (change in Render dashboard)

---

## Troubleshooting

### "Backend not responding"
- Render free tier spins down after inactivity
- First request will take 30 seconds as it starts up
- Check Render dashboard to confirm service is running

### "GitHub Actions failed"
- Check **Actions** tab for error logs
- Ensure `VITE_API_URL` secret is set correctly
- Run locally first: `npm run build`

### "403 Forbidden on images"
- Images folder isn't included in GitHub Pages build
- Solution: Upload images to backend or use external CDN
- Currently images must be in `frontend/public/images/`

---

## Next Steps

### Security (Important!)
1. Change admin password in Render environment variables
2. Set strong `JWT_SECRET` (Render generates one automatically)
3. Enable HTTPS (automatic with GitHub Pages & Render)

### Custom Domain
1. GitHub Pages: Add CNAME file and DNS settings
2. Render: Add custom domain in service settings

### Database Backups
Render provides automated backups (check dashboard settings)

---

## Manual Testing

Test the deployment locally first:

```bash
# Install dependencies
npm install --prefix frontend

# Build
npm run build --prefix frontend

# Serve locally (with backend)
docker compose up
```

Then deploy with confidence!

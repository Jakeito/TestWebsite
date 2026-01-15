# FREE Deployment Setup Complete ✅

Your website is now configured for **completely free hosting** on GitHub Pages (frontend) and Render (backend + database).

## Quick Start (2 Steps)

### Step 1: Deploy Backend to Render (5 minutes)

1. Go to [render.com](https://render.com) and **sign up FREE** (or login)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository (`Jakeito/TestWebsite`)
4. Render will automatically detect `render.yaml` and deploy everything:
   - Go backend service
   - PostgreSQL database
5. **Copy your backend URL** (looks like: `https://testwebsite-backend.onrender.com`)

### Step 2: Configure GitHub Actions Secret

1. Go to GitHub → Your repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. Create one secret:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://testwebsite-backend.onrender.com/api` (use your Render URL)
4. Save

GitHub Actions will automatically deploy your frontend to GitHub Pages on every push to `main`.

---

## After Deployment

Your website will be live at:
- **Frontend**: `https://jakeito.github.io/TestWebsite`
- **Backend API**: `https://testwebsite-backend.onrender.com/api`
- **Admin**: `https://jakeito.github.io/TestWebsite/admin`

**Default admin credentials:**
- Email: `admin@example.com`
- Password: `changeme`

---

## Files Created

- `.github/workflows/deploy.yml` - Automatic GitHub Pages deployment
- `render.yaml` - Infrastructure as Code for Render (backend + database)
- `DEPLOYMENT.md` - Detailed deployment guide
- `frontend/vite.config.ts` - Updated for GitHub Pages base path
- `frontend/src/services/api.ts` - Updated to use environment variables

---

## Important Notes

### Free Tier Behavior

**Render (Backend)**
- Free tier includes 750 hours/month (enough for always-on)
- Database spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds (one-time)
- No credit card required initially

**GitHub Pages**
- Completely free with unlimited bandwidth
- Never spins down, always available

### Next: Change Admin Password

Once deployed, login to admin panel and change the password:
1. Go to `https://jakeito.github.io/TestWebsite/admin`
2. Login with `admin@example.com` / `changeme`
3. Change password in Render dashboard (environment variables)

---

## Future Upgrades (Optional)

- **Add credit card to Render** for guaranteed uptime (stays cheaper than most alternatives)
- **Custom domain** on both frontend and backend
- **Email notifications** for contact submissions
- **Image optimization** CDN (Cloudflare is free)

---

## Commands for Reference

Deploy locally (without cloud):
```bash
cd /path/to/TestWebsite
docker compose up -d
# Then visit http://localhost:3000
```

Force redeploy frontend:
```bash
git push origin main  # GitHub Actions auto-deploys
```

Check deployment status:
- Frontend: GitHub repo → **Actions** tab
- Backend: Render dashboard → Services

---

## Questions?

See `DEPLOYMENT.md` for detailed troubleshooting and FAQs.
# Deployed on Wed Jan 14 22:07:03 CST 2026

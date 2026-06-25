# 🚀 Railway Deployment - Quick Start

**TL;DR:** Deploy Med-System to Railway in 5 minutes.

## Prerequisites
- Railway account: https://railway.app
- Railway CLI: `npm install -g @railway/cli`
- Git repo with commits

## 1️⃣ Login to Railway
```bash
railway login
railway init
```

## 2️⃣ Configure Environment
In Railway Dashboard → Variables, add:
```
JWT_SECRET=generate-strong-secret-here
NODE_ENV=production
LOG_LEVEL=info
```

(Other variables auto-configured by Railway)

## 3️⃣ Deploy
```bash
# Option A: Using CLI
railway trigger

# Option B: Push to GitHub (if auto-deploy enabled)
git push origin main
```

## 4️⃣ Run Migrations
```bash
railway run npm run prisma:migrate
```

## 5️⃣ Verify
```bash
# Check status
railway status

# View logs
railway logs

# Test health endpoint
curl https://your-app.up.railway.app/health
```

## ✅ Done!

Your API is live on Railway! 🎉

---

## Next Steps
- See [DEPLOY.md](./DEPLOY.md) for detailed guide
- Monitor: `railway logs -f`
- Scale: Railway Dashboard → Service → Resources

---

## Common Commands
```bash
railway status              # Current status
railway logs -f             # Real-time logs
railway logs -s api         # Logs from API service
railway rollback <id>       # Rollback deployment
railway open                # Open dashboard
railway shell               # SSH into container
```

---

## Troubleshooting
- **Build failed?** Check: `railway logs`
- **DB connection error?** Run: `railway run npm run prisma:migrate`
- **Out of memory?** Increase: Railway Dashboard → Resources
- **App won't start?** Check environment variables

---

For more details, see **[DEPLOY.md](./DEPLOY.md)** or visit https://docs.railway.app

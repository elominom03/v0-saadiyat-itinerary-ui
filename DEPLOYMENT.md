# Deployment Guide

## Vercel Deployment

### Quick Deploy

1. **Push to GitHub**
```bash
git add .
git commit -m "Add backend and AI integration"
git push origin main
```

2. **Import to Vercel**
- Go to [vercel.com/new](https://vercel.com/new)
- Import your repository
- Vercel will auto-detect Next.js

3. **Set Environment Variables**

In Vercel Dashboard → Settings → Environment Variables, add:

```
DATABASE_URL=file:./dev.db
GEMINI_API_KEY=your-actual-gemini-api-key
```

4. **Deploy**
- Click "Deploy"
- Wait for build to complete
- Access your live URL

### Post-Deployment Setup

After first deployment, seed the database:

```bash
# Install Vercel CLI
npm i -g vercel

# Pull environment variables
vercel env pull .env.local

# Connect to your Vercel project
vercel link

# Run migration and seed
vercel exec -- npx prisma migrate deploy
vercel exec -- npx prisma generate
vercel exec -- pnpm db:seed
```

Or use the Vercel dashboard to run these commands in the "Deployments" tab.

### Production Database (Recommended)

For production, migrate from SQLite to PostgreSQL:

#### Option 1: Vercel Postgres

1. **Create Database**
```bash
vercel postgres create
```

2. **Link to Project**
```bash
vercel postgres link
```

3. **Update Schema**
Edit `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
}
```

4. **Update Adapter**
Edit `lib/prisma.ts`:
```typescript
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
})

const adapter = new PrismaPg(pool)

export const prisma = global.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma
}
```

5. **Install pg**
```bash
pnpm add pg @types/pg
```

6. **Deploy**
```bash
git add .
git commit -m "Migrate to Postgres"
git push
```

#### Option 2: Neon

1. Create account at [neon.tech](https://neon.tech)
2. Create database
3. Copy connection string
4. Add to Vercel environment variables
5. Follow same schema/adapter update as above

### Environment Variables Checklist

Required:
- ✅ `GEMINI_API_KEY` - Google Gemini API key
- ✅ `DATABASE_URL` - Database connection string

Optional (for production):
- `NODE_ENV=production` - Automatically set by Vercel
- Redis/Upstash URL - For production rate limiting

### Build Configuration

Vercel will automatically use:
```json
{
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install",
  "framework": "nextjs"
}
```

### Domains

1. **Custom Domain**
- Go to Project Settings → Domains
- Add your domain
- Follow DNS instructions

2. **SSL Certificate**
- Automatically provisioned by Vercel
- No configuration needed

### Monitoring

1. **Runtime Logs**
- Vercel Dashboard → Deployments → Functions
- View real-time logs

2. **Analytics** (Optional)
- Enable Vercel Analytics in dashboard
- Add `@vercel/analytics` package

3. **Error Tracking** (Recommended)
```bash
pnpm add @sentry/nextjs
```

### Performance Optimization

1. **Edge Caching** for `/api/attractions`:
```typescript
export const runtime = 'edge'
export const revalidate = 60 // Cache for 60 seconds
```

2. **Image Optimization**
- Already handled by Next.js Image component
- Vercel automatically optimizes images

3. **Bundle Analysis**
```bash
pnpm add @next/bundle-analyzer
```

### Troubleshooting

**Build fails with Prisma error:**
```bash
# Add this to package.json scripts:
"postinstall": "prisma generate"
```

**Database connection fails:**
- Check `DATABASE_URL` format
- Verify database is accessible
- Check Prisma adapter compatibility

**API returns 500:**
- Check Vercel function logs
- Verify `GEMINI_API_KEY` is set
- Check rate limits

### Rollback

If deployment breaks:
```bash
vercel rollback
```

Or use Vercel Dashboard → Deployments → Click previous deployment → Promote to Production

### CI/CD (GitHub Actions)

Optional: Add automated testing before deploy

`.github/workflows/deploy.yml`:
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - name: Install
        run: pnpm install
      - name: Build
        run: pnpm build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Cost Estimation

**Vercel Pro:**
- 100GB bandwidth/month: ~$20/month
- Serverless function invocations: included

**Gemini API:**
- Free tier: 60 requests/minute
- Paid: $0.00025 per request

**Database:**
- Vercel Postgres: Starting at $10/month
- Neon: Free tier available

**Total estimated cost:** $10-30/month for moderate traffic

### Support

- Vercel: https://vercel.com/support
- Prisma: https://www.prisma.io/docs
- Next.js: https://nextjs.org/docs

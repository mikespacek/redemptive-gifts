# Manual Deployment Guide for Redemptive Gifts App

Since the automatic deployment through GitHub is encountering issues, here's a step-by-step guide to deploy manually.

## Option 1: Deploy Using Vercel Dashboard

1. **Log in to Vercel**
   - Go to [vercel.com](https://vercel.com) and log in to your account

2. **Create a New Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository (mikespacek/redemptive-gifts)
   - If the repository is already connected, you may need to disconnect and reconnect it

3. **Configure Project Settings**
   - Framework Preset: Next.js
   - Build Command: `npm install && npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
   - Node.js Version: 18.x (or higher)

4. **Environment Variables**
   - Add any necessary environment variables:
     - `NEXT_PUBLIC_CONVEX_URL`: Your Convex URL
     - `RESEND_API_KEY`: Your Resend API key

5. **Deploy**
   - Click "Deploy" and wait for the build to complete

## Option 2: Deploy Using Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Log in to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from Your Project Directory**
   ```bash
   cd /path/to/redemptive-gifts
   vercel --prod
   ```

4. **Follow the Interactive Setup**
   - When prompted, select the appropriate project settings
   - Confirm the deployment

## Option 3: Use the Included Deploy Script

1. **Run the Deploy Script**
   ```bash
   node deploy.js
   ```

2. **Follow the Prompts**
   - The script will install the Vercel CLI if needed
   - It will then trigger a production deployment

## Troubleshooting

If you encounter issues during deployment:

1. **Check for Dependency Issues**
   - Try running `npm install` locally to see if there are any dependency conflicts

2. **Verify Node.js Version**
   - Make sure you're using Node.js 18 or higher: `node --version`

3. **Check for Build Errors**
   - Run `npm run build` locally to see if there are any build errors

4. **Clear Vercel Cache**
   - In the Vercel dashboard, go to Project Settings → General → Build & Development Settings
   - Click "Clear Build Cache"

5. **Contact Vercel Support**
   - If all else fails, reach out to Vercel support with the error logs

## After Deployment

Once deployed successfully:

1. **Verify Functionality**
   - Test all features of the application
   - Make sure emails are being sent correctly

2. **Set Up Custom Domain**
   - In the Vercel dashboard, go to Project Settings → Domains
   - Add your custom domain and follow the DNS configuration instructions

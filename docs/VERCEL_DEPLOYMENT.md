# Vercel Deployment Guide

This repository is configured to be deployed as a Monorepo on Vercel, with:

- **Frontend**: `apps/web` (Vite SPA)
- **Backend**: `apps/api` (Express via Serverless Function)

## 1. Project Setup in Vercel

1.  Import the repository in Vercel.
2.  Use the **Root Directory** as `./` (default).
3.  **Framework Preset**: Vite (should detect automatically).
4.  **Build Command**: `pnpm turbo run build --filter=@dashboardized/web`
5.  **Output Directory**: `apps/web/dist`

## 2. Environment Variables

You must add the following **Environment Variables** in your Vercel Project Settings.

### Backend Config

| Variable                | Value                                | Description                                    |
| :---------------------- | :----------------------------------- | :--------------------------------------------- |
| `AUTH0_ISSUER_BASE_URL` | `https://your-domain.auth0.com`      | Your Auth0 Domain URL                          |
| `AUTH0_AUDIENCE`        | `https://api.dashboardized.com`      | Your API Identifier in Auth0                   |
| `FRONTEND_URL`          | `https://your-vercel-app.vercel.app` | Production URL of your app (no trailing slash) |

### Frontend Config

| Variable                  | Value                                         | Description                                       |
| :------------------------ | :-------------------------------------------- | :------------------------------------------------ |
| `VITE_API_URL`            | `/api`                                        | Relative path for API calls (handled by rewrites) |
| `VITE_AUTH0_DOMAIN`       | `your-domain.auth0.com`                       | Your Auth0 Domain                                 |
| `VITE_AUTH0_CLIENT_ID`    | `your-client-id`                              | Your Auth0 Application Client ID                  |
| `VITE_AUTH0_CALLBACK_URL` | `https://your-vercel-app.vercel.app/callback` | Production Callback URL                           |
| `VITE_AUTH0_AUDIENCE`     | `https://api.dashboardized.com`               | Must match Backend's Audience                     |

## 3. Auth0 Configuration

In your **Auth0 Dashboard**:

1.  Go to your Application settings.
2.  Add your Production URL (`https://your-vercel-app.vercel.app`) to:
    - **Allowed Callback URLs** (+ `/callback` suffix)
    - **Allowed Logout URLs**
    - **Allowed Web Origins**
    - **Allowed Origins (CORS)**

## 4. Updates & Redeploys

Vercel will automatically redeploy on every push to `main`.

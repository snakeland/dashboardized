# Auth0 Setup Guide for Dashboardized

This guide explains how to configure Auth0 for local development and production.

---

## 1. Create an Auth0 Application

1. Go to [auth0.com](https://auth0.com) and sign up or log in.
2. In the Auth0 dashboard, go to **Applications → Applications**.
3. Click **Create Application**.
   - Name: `Dashboardized`
   - Type: **Single Page Web Applications**
4. Click **Create**.

---

## 2. Enable Social Connections

- In your application, go to **Authentication → Social**.
- Enable **Google** and **GitHub**.
- Follow Auth0’s prompts to set up developer keys for each provider.

---

## 3. Configure Application Settings

- **Allowed Callback URLs:**  
  `http://localhost:3000/callback`
- **Allowed Logout URLs:**  
  `http://localhost:3000`
- **Allowed Web Origins:**  
  `http://localhost:3000`
- **Allowed Origins (CORS):**  
  `http://localhost:3000`

Add your production URLs as needed.

---

## 4. Get Your Auth0 Credentials

- **Domain:** (e.g. `dev-xxxxxx.us.auth0.com`)
- **Client ID:** (from your application)
- **Client Secret:** (for backend if needed)
- **Audience:** (API Identifier, e.g. `https://api.dashboardized.com`)

---

## 5. Set Environment Variables

### Frontend (`apps/web/.env`)

```
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_CALLBACK_URL=http://localhost:3000/callback
VITE_AUTH0_AUDIENCE=https://api.dashboardized.com
```

### Backend (`apps/api/.env`)

```
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_AUDIENCE=https://api.dashboardized.com
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
FRONTEND_URL=http://localhost:3000
```

---

## 6. Run the App

From the repo root:

```bash
pnpm install
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) and test login.

---

## 7. Troubleshooting

- Double-check callback/logout URLs in Auth0 dashboard.
- Ensure all environment variables are set.
- Check browser console and backend logs for errors.

---

## 8. References

- [Auth0 Vue SDK Docs](https://auth0.com/docs/quickstart/spa/vue/01-login)
- [Auth0 Social Connections](https://auth0.com/docs/authenticate/social)
- [Dashboardized README](../README.md)

---

_Last updated: 2025-12-15 — Dashboardized team_

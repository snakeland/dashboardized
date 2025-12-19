# @dashboardized/web

## 0.1.0

### Minor Changes

- c74b3aa: Implement OAuth authentication with Auth0

  This major feature addition enables user authentication using Auth0 with Google and GitHub OAuth providers. Users can now:
  - Sign in with Google or GitHub accounts
  - Access protected dashboard pages
  - Have their preferences stored per user
  - View their profile information

  **Backend Changes:**
  - Added JWT validation middleware using express-oauth2-jwt-bearer
  - Created `/api/auth/me` endpoint for user info
  - Created `/api/user/dashboard` endpoints for user preferences
  - Configured CORS for authentication credentials

  **Frontend Changes:**
  - Integrated @auth0/auth0-vue SDK
  - Created Pinia auth store for state management
  - Built LoginPage with OAuth provider buttons
  - Added CallbackPage for OAuth redirect handling
  - Created protected DashboardPage with user profile
  - Implemented router navigation guards

  **Type System:**
  - Added User, AuthSession, AuthTokens types
  - Added DashboardPreferences interface

  **Configuration:**
  - Updated .env.example files with Auth0 variables
  - Documented required Auth0 setup steps

  This addresses issue #2 and enables the core personalization features of Dashboardized.

- fb72b4a: Restrict WeatherWidget to logged-in users, fix layout issues, and widen widget on dashboard.

### Patch Changes

- Updated dependencies [c74b3aa]
- Updated dependencies [fb72b4a]
  - @dashboardized/types@0.1.0
  - @dashboardized/widgets@0.1.0

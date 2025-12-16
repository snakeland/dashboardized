import { useAuth0 } from '@auth0/auth0-vue'
import { useAuthStore } from '../stores/auth'


/**
 * Composable that wraps Auth0 SDK and integrates with Pinia store
 * Provides unified auth interface for components
 */
export function useAuth() {
  const auth0 = useAuth0()
  const authStore = useAuthStore()

  // Watcher removed - moved to App.vue to prevent multiple instances

  /**
   * Login with redirect to Auth0
   */
  const login = async () => {
    try {
      authStore.setLoading(true)
      await auth0.loginWithRedirect({
        appState: {
          target: '/dashboard',
        },
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      authStore.setError(message)
      console.error('Login error:', err)
    } finally {
      authStore.setLoading(false)
    }
  }

  /**
   * Login with a specific OAuth connection (Google or GitHub)
   */
  const loginWithProvider = async (connection: 'google-oauth2' | 'github') => {
    try {
      authStore.setLoading(true)
      await auth0.loginWithRedirect({
        authorizationParams: {
          connection,
        },
        appState: {
          target: '/dashboard',
        },
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      authStore.setError(message)
      console.error('Login error:', err)
    } finally {
      authStore.setLoading(false)
    }
  }

  /**
   * Logout and redirect to home
   */
  const logout = async () => {
    try {
      authStore.setLoading(true)
      await authStore.logout()
      await auth0.logout({
        logoutParams: {
          returnTo: window.location.origin,
        },
      })
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      authStore.setLoading(false)
    }
  }

  /**
   * Get access token for API calls
   */
  const getAccessToken = async (): Promise<string | undefined> => {
    try {
      return await auth0.getAccessTokenSilently()
    } catch (err) {
      console.error('Failed to get access token:', err)
      return undefined
    }
  }

  return {
    // Auth0 state
    isAuthenticated: auth0.isAuthenticated,
    isLoading: auth0.isLoading,
    user: authStore.user,
    error: authStore.error,
    // Actions
    login,
    loginWithProvider,
    logout,
    getAccessToken,
  }
}

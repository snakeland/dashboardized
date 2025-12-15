import { useAuth0 } from '@auth0/auth0-vue'
import { useAuthStore } from '../stores/auth'
import { watch } from 'vue'

/**
 * Composable that wraps Auth0 SDK and integrates with Pinia store
 * Provides unified auth interface for components
 */
export function useAuth() {
  const auth0 = useAuth0()
  const authStore = useAuthStore()

  // Sync Auth0 user with Pinia store
  watch(
    () => auth0.user.value,
    async (auth0User) => {
      if (auth0User && auth0.isAuthenticated.value) {
        const accessToken = await auth0.getAccessTokenSilently()

        // Transform Auth0 user to our User type
        const user = {
          id: auth0User.sub || '',
          email: auth0User.email || '',
          name: auth0User.name || '',
          picture: auth0User.picture,
          provider: 'auth0' as const,
          createdAt: new Date(auth0User.updated_at || Date.now()),
          updatedAt: new Date(auth0User.updated_at || Date.now()),
        }

        authStore.setUser(user)

        // Fetch additional user info from our API
        await authStore.fetchUser(accessToken)
      } else {
        authStore.clearAuth()
      }
    },
    { immediate: true }
  )

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

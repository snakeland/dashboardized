import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@dashboardized/types'

/**
 * Pinia store for authentication state management
 * Manages user info, authentication status, and dashboard preferences
 */
export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const userName = computed(() => user.value?.name || 'User')
  const userEmail = computed(() => user.value?.email || '')

  // Actions
  function setUser(userData: User | null) {
    user.value = userData
    error.value = null
  }

  function setLoading(loading: boolean) {
    isLoading.value = loading
  }

  function setError(errorMessage: string | null) {
    error.value = errorMessage
  }

  function clearAuth() {
    user.value = null
    error.value = null
    isLoading.value = false
  }

  /**
   * Fetch current user from API
   */
  async function fetchUser(accessToken: string) {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch user info')
      }

      const data = await response.json()
      setUser(data.user)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      console.error('Failed to fetch user:', err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Logout and clear all auth state
   */
  async function logout() {
    try {
      // Optional: call backend logout endpoint
      await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
        method: 'POST',
      })
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      clearAuth()
    }
  }

  return {
    // State
    user,
    isLoading,
    error,
    // Getters
    isAuthenticated,
    userName,
    userEmail,
    // Actions
    setUser,
    setLoading,
    setError,
    clearAuth,
    fetchUser,
    logout,
  }
})

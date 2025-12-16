<script setup lang="ts">
import { RouterView } from 'vue-router'
import { watch } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useAuthStore } from './stores/auth'

const auth0 = useAuth0()
const authStore = useAuthStore()

// Sync Auth0 user with Pinia store (Singleton)
watch(
  () => auth0.user.value,
  async (auth0User) => {
    if (auth0User && auth0.isAuthenticated.value) {
      try {
        const accessToken = await auth0.getAccessTokenSilently()

        // Transform Auth0 user to our User type
        const user = {
          id: auth0User.sub || '',
          email: auth0User.email || '',
          name: auth0User.name || auth0User.nickname || auth0User.email || '',
          picture: auth0User.picture,
          provider: 'auth0' as const,
          createdAt: new Date(auth0User.updated_at || Date.now()),
          updatedAt: new Date(auth0User.updated_at || Date.now()),
        }

        authStore.setUser(user)

        // Fetch additional user info from our API
        await authStore.fetchUser(accessToken)

        // Merge Auth0 data with API data
        // Prioritize Auth0 name/picture to ensure they display correctly
        if (authStore.user) {
          authStore.setUser({
            ...authStore.user,
            name: user.name || authStore.user.name,
            picture: user.picture || authStore.user.picture,
          })
        }
      } catch (err) {
        console.error('Auth sync error:', err)
      }
    } else {
      authStore.clearAuth()
    }
  },
  { immediate: true }
)
</script>

<template>
  <div
    id="app"
    class="min-h-screen bg-gray-50"
  >
    <RouterView />
  </div>
</template>

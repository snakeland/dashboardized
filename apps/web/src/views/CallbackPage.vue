<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    <div class="text-center">
      <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-4" />
      <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Completing authentication...
      </h2>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        Please wait while we redirect you.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'

const router = useRouter()
const auth0 = useAuth0()

onMounted(async () => {
  try {
    // Handle the Auth0 callback
    const result = await auth0.handleRedirectCallback()
    
    // Get the redirect target from appState, default to dashboard
    const appState = (result?.appState as { target?: string }) || {}
    const target = appState.target || '/dashboard'
    
    // Redirect to the target page
    router.push(target)
  } catch (error) {
    console.error('Auth callback error:', error)
    // On error, redirect to login
    router.push('/login')
  }
})
</script>

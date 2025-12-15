<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            My Dashboard
          </h1>
          
          <!-- User Menu -->
          <div class="flex items-center gap-4">
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ userName }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ userEmail }}
              </p>
            </div>
            
            <img
              v-if="user?.picture"
              :src="user.picture"
              :alt="userName"
              class="h-10 w-10 rounded-full"
            >
            
            <button
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
              @click="handleLogout"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Welcome back, {{ userName }}!
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
          Your personalized dashboard is ready. Add and customize widgets to track what matters to you.
        </p>
      </div>

      <!-- Widgets Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Placeholder for widgets -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Weather Widget
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Widget integration coming soon...
          </p>
        </div>

        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-2 border-dashed border-gray-300 dark:border-gray-600">
          <div class="text-center text-gray-500 dark:text-gray-400">
            <svg
              class="mx-auto h-12 w-12 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <p class="text-sm">
              Add a widget
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '../composables/useAuth'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const { logout } = useAuth()
const authStore = useAuthStore()
const router = useRouter()

const user = authStore.user
const userName = authStore.userName
const userEmail = authStore.userEmail

const handleLogout = async () => {
  await logout()
  router.push('/login')
}
</script>

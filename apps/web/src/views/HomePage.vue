<script setup lang="ts">
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'


const { isAuthenticated, login, logout, user, isLoading } = useAuth()
const router = useRouter()

const navigateToDashboard = () => {
  router.push('/dashboard')
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <header class="text-center mb-12 relative">
      <div class="absolute top-0 right-0 flex gap-4">
        <template v-if="!isLoading">
          <button
            v-if="!isAuthenticated"
            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm transition-colors"
            @click="login"
          >
            Sign In
          </button>
          <div
            v-else
            class="flex items-center gap-4"
          >
            <span class="text-sm text-gray-600 dark:text-gray-300">
              Welcome, {{ user?.name }}
            </span>
            <button
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md shadow-sm transition-colors dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
              @click="logout"
            >
              Log Out
            </button>
          </div>
        </template>
      </div>

      <h1 class="text-4xl font-bold text-gray-900 mb-4 pt-10">
        Dashboardized
      </h1>
      <p class="text-xl text-gray-600 mb-8">
        Your Personalized Dashboard Platform
      </p>

      <div
        v-if="isAuthenticated"
        class="flex justify-center"
      >
        <button
          class="px-6 py-3 text-base font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-md transition-colors flex items-center gap-2"
          @click="navigateToDashboard"
        >
          <span>Go to Dashboard</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </header>

    <div class="max-w-7xl mx-auto">
      <!-- Widgets Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Promo Card - Half Width -->
        <div class="col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 flex flex-col items-center justify-center text-center border border-gray-100 dark:border-gray-700">
          <div class="bg-indigo-100 dark:bg-indigo-900/30 p-4 rounded-full mb-6 relative group overflow-hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-12 w-12 text-indigo-600 dark:text-indigo-400 relative z-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
              />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Weather & More
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-8 max-w-sm">
            Log in to access your personalized dashboard with live weather updates, stock tracking, and custom widgets.
          </p>
          <button
            v-if="!isAuthenticated"
            class="px-6 py-3 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md transition-colors"
            @click="login"
          >
            Sign In to Unlock
          </button>
        </div>

        <!-- Placeholder for more widgets -->
        <div class="col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700">
          <div class="text-center text-gray-400 dark:text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-16 w-16 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <p class="text-lg">
              More widgets coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


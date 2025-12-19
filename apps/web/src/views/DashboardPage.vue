<template>
  <div class="min-h-screen bg-white dark:bg-gray-950">
    <AppNavbar />

    <!-- Dashboard Header -->
    <header class="py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="md:flex md:items-center md:justify-between">
          <div class="flex-1 min-w-0">
            <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl tracking-tight">
              My Dashboard
            </h2>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Personalized workspace for {{ userName }} ({{ userEmail }})
            </p>
          </div>
          <div class="mt-4 flex md:mt-0 md:ml-4 gap-3">
            <button
              type="button"
              class="inline-flex items-center px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Widget
            </button>
            <button
              type="button"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Settings
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Weather Widget -->
        <div class="col-span-1 md:col-span-2">
          <div class="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            <WeatherWidget />
          </div>
        </div>

        <!-- Add Widget Placeholder -->
        <div class="bg-gray-50 dark:bg-gray-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 p-8 flex flex-col items-center justify-center text-center transition-all hover:border-indigo-300 dark:hover:border-indigo-700 group cursor-pointer">
          <div class="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
            <svg
              class="h-6 w-6 text-gray-400 group-hover:text-indigo-600"
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
          </div>
          <p class="text-sm font-semibold text-gray-600 dark:text-gray-400">
            Add a new widget
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { WeatherWidget } from '@dashboardized/widgets'
import AppNavbar from '../components/AppNavbar.vue'

const authStore = useAuthStore()

const userName = authStore.userName
const userEmail = authStore.userEmail
</script>

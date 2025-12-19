<template>
  <nav class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-32 items-center">
        <!-- Logo -->
        <router-link
          to="/"
          class="flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <img
            src="../assets/images/logo.png"
            alt="Dashboardized Logo"
            class="h-24 w-auto"
          >
        </router-link>

        <!-- Navigation Actions -->
        <div class="flex items-center gap-4">
          <template v-if="!isLoading">
            <template v-if="!isAuthenticated">
              <router-link
                v-if="$route.path !== '/login'"
                to="/login"
                class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Sign In
              </router-link>
            </template>
            <template v-else>
              <div class="flex items-center gap-4">
                <router-link
                  v-if="$route.path !== '/dashboard'"
                  to="/dashboard"
                  class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Dashboard
                </router-link>
                
                <!-- Simple Profile / Logout -->
                <div class="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-2" />
                
                <button
                  class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  @click="logout"
                >
                  Log Out
                </button>
              </div>
            </template>
          </template>
          
          <!-- Loading State -->
          <div
            v-else
            class="h-8 w-8 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-full"
          />
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuth } from '../composables/useAuth'
import { useRoute } from 'vue-router'

const { isAuthenticated, isLoading, logout } = useAuth()
const $route = useRoute()
</script>

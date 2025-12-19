<script setup lang="ts">
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'
import AppNavbar from '../components/AppNavbar.vue'

const { isAuthenticated, login, isLoading } = useAuth()
const router = useRouter()

const navigateToDashboard = () => {
  router.push('/dashboard')
}
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-950">
    <AppNavbar />

    <!-- Hero Section -->
    <section class="relative pt-20 pb-16 overflow-hidden">
      <div class="container mx-auto px-4 relative z-10">
        <div class="text-center max-w-4xl mx-auto">
          <h1 class="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
            Monitor everything in <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">one place</span>
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
            A minimalist, high-performance dashboard platform that keeps your most important data just one click away.
          </p>

          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <template v-if="!isLoading">
              <button
                v-if="!isAuthenticated"
                class="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:scale-105"
                @click="login"
              >
                Get Started for Free
              </button>
              <button
                v-else
                class="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 flex items-center justify-center gap-2"
                @click="navigateToDashboard"
              >
                Go to Dashboard
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
            </template>
          </div>
        </div>
      </div>

      <!-- Animated Background Element -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl pointer-events-none opacity-20 dark:opacity-10">
        <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-400 rounded-full blur-[100px]" />
        <div class="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-400 rounded-full blur-[100px]" />
      </div>
    </section>

    <!-- Features Section -->
    <section class="max-w-7xl mx-auto px-4 py-20 border-t border-gray-100 dark:border-gray-900">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div class="p-8 rounded-2xl bg-gray-50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-900 transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-800 group">
          <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-indigo-600"
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
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Real-time Weather
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            Stay updated with hyper-local weather reports directly on your dashboard.
          </p>
        </div>

        <div class="p-8 rounded-2xl bg-gray-50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-900 transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-800 group">
          <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-purple-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6V4m0 2a2 2 0 102 2 2 2 0 00-2-2zm0 6V4m0 6a2 2 0 102 2 2 2 0 00-2-2zm0 6V4m0 6a2 2 0 102 2 2 2 0 00-2-2z"
              />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Custom Widgets
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            Choose from a variety of widgets to personalize your workspace exactly how you like it.
          </p>
        </div>

        <div class="p-8 rounded-2xl bg-gray-50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-900 transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-800 group">
          <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Secure & Fast
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            Enterprise-grade security with Auth0 integration ensures your data is always safe.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>


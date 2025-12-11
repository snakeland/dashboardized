<script setup lang="ts">
import { WeatherWidget } from '@dashboardized/widgets'
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <header class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        Dashboardized
      </h1>
      <p class="text-xl text-gray-600">
        Your Personalized Dashboard Platform
      </p>
    </header>

    <div class="max-w-7xl mx-auto">
      <!-- Widgets Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Weather Widget - Half Width -->
        <div class="col-span-1">
          <WeatherWidget />
        </div>

        <!-- Placeholder for more widgets -->
        <div class="col-span-1 bg-white rounded-lg shadow-md p-8 flex items-center justify-center border-2 border-dashed border-gray-300">
          <div class="text-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <p class="text-lg">More widgets coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

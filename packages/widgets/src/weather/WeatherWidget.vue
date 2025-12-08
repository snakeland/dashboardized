<template>
  <WidgetErrorBoundary>
    <div class="weather-widget bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg p-6 border border-gray-200">
      <!-- Header with Title and Refresh -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Weather</h2>
        <div class="flex items-center gap-3">
          <span v-if="lastUpdated" class="text-xs text-gray-500 whitespace-nowrap">
            Updated {{ lastUpdatedText }}
          </span>
          <button
            @click="handleRefresh"
            :disabled="isLoading"
            class="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :class="{ 'animate-spin': isLoading }"
            aria-label="Refresh weather data"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- City Search Autocomplete -->
      <div class="mb-6 relative">
        <label for="city-search" class="block text-sm font-semibold text-gray-700 mb-2">
          🔍 Search City
        </label>
        <input
          id="city-search"
          v-model="searchQuery"
          @input="handleSearchInput"
          type="text"
          placeholder="Enter city name..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          :disabled="isLoading"
        />
        
        <!-- Autocomplete Dropdown -->
        <div
          v-if="searchResults.length > 0 && showDropdown"
          class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          <button
            v-for="city in searchResults"
            :key="`${city.id}-${city.latitude}-${city.longitude}`"
            @click="selectCity(city)"
            class="w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors focus:bg-blue-50 focus:outline-none"
          >
            <div class="font-medium text-gray-900">{{ city.name }}</div>
            <div class="text-sm text-gray-500">
              {{ [city.admin1, city.country].filter(Boolean).join(', ') }}
            </div>
          </button>
        </div>

        <!-- Search Loading Indicator -->
        <div v-if="isSearching" class="absolute right-3 top-10 text-gray-400">
          <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>

      <!-- Selected City Display -->
      <div v-if="selectedCity" class="mb-6 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
        <div class="flex items-center gap-2 text-sm text-blue-900">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
          </svg>
          <span class="font-medium">{{ selectedCity.name }}, {{ [selectedCity.admin1, selectedCity.country].filter(Boolean).join(', ') }}</span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading && !weatherData" class="space-y-4">
        <div class="animate-pulse">
          <div class="h-32 bg-gray-200 rounded-lg mb-4"></div>
          <div class="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        <div class="flex items-start gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <div>
            <p class="font-medium">{{ error }}</p>
            <button
              @click="handleRefresh"
              class="mt-2 text-sm underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>

      <!-- Weather Data Display -->
      <div v-else-if="weatherData" class="space-y-6">
        <!-- Current Weather Card -->
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-8 text-white shadow-lg">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-80" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                </svg>
                <p class="text-sm opacity-90 font-medium">{{ todayDateFormatted }}</p>
              </div>
              <div class="flex items-center gap-3 mb-4">
                <span class="text-3xl">{{ currentWeatherIcon }}</span>
                <span class="text-xl font-semibold">{{ currentWeatherText }}</span>
              </div>
              <div class="flex items-baseline gap-3">
                <span class="text-6xl font-bold tracking-tight">{{ Math.round(weatherData.forecast.maxTemperatures[0]) }}°</span>
                <span class="text-3xl opacity-80 font-medium">/ {{ Math.round(weatherData.forecast.minTemperatures[0]) }}°</span>
              </div>
            </div>
            <div class="hidden sm:block text-8xl opacity-20 ml-4">
              {{ currentWeatherIcon }}
            </div>
          </div>
        </div>

        <!-- 7-Day Forecast Chart -->
        <div>
          <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            7-Day Forecast
          </h3>
          <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <ChartLine
              :labels="formattedDates"
              :data="weatherData.forecast.maxTemperatures"
              :data-secondary="weatherData.forecast.minTemperatures"
              :data-label="'Max Temp (°C)'"
              :data-secondary-label="'Min Temp (°C)'"
              :highlight-index="0"
              chart-id="weather-forecast-chart"
            />
          </div>
        </div>

        <!-- Additional Info -->
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div class="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-4 border border-red-100">
            <p class="text-gray-600 text-xs uppercase tracking-wide mb-1 font-medium">High Today</p>
            <p class="text-3xl font-bold text-red-600">
              {{ Math.round(weatherData.forecast.maxTemperatures[0]) }}°
            </p>
          </div>
          <div class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
            <p class="text-gray-600 text-xs uppercase tracking-wide mb-1 font-medium">Low Today</p>
            <p class="text-3xl font-bold text-blue-600">
              {{ Math.round(weatherData.forecast.minTemperatures[0]) }}°
            </p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16 px-4">
        <div class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">No Location Selected</h3>
        <p class="text-gray-500">Search for a city above to view weather forecast</p>
      </div>
    </div>
  </WidgetErrorBoundary>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { ChartLine, WidgetErrorBoundary } from '@dashboardized/ui';
import { searchCities, getWeatherForLocation } from './weatherService';
import { getWeatherInfo } from './weatherTypes';
import type { GeocodingResult, ProcessedWeatherData } from './weatherTypes';

// Component Props
interface WeatherWidgetProps {
  refreshInterval?: number; // in milliseconds, default 30 minutes
  defaultCity?: {
    name: string;
    latitude: number;
    longitude: number;
  };
}

const props = withDefaults(defineProps<WeatherWidgetProps>(), {
  refreshInterval: 30 * 60 * 1000, // 30 minutes
});

// Reactive State
const searchQuery = ref('');
const searchResults = ref<GeocodingResult[]>([]);
const showDropdown = ref(false);
const isSearching = ref(false);
const selectedCity = ref<GeocodingResult | null>(null);
const weatherData = ref<ProcessedWeatherData | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);
const lastUpdated = ref<Date | null>(null);
const refreshTimer = ref<number | null>(null);

// Computed Properties
const lastUpdatedText = computed(() => {
  if (!lastUpdated.value) return '';
  
  const now = new Date();
  const diffMs = now.getTime() - lastUpdated.value.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'just now';
  if (diffMins === 1) return '1 minute ago';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours === 1) return '1 hour ago';
  return `${diffHours} hours ago`;
});

const currentWeatherIcon = computed(() => {
  if (!weatherData.value) return '☁️';
  const weatherInfo = getWeatherInfo(weatherData.value.forecast.weatherCodes[0]);
  return weatherInfo.icon;
});

const currentWeatherText = computed(() => {
  if (!weatherData.value) return '';
  const weatherInfo = getWeatherInfo(weatherData.value.forecast.weatherCodes[0]);
  return weatherInfo.description;
});

const formattedDates = computed(() => {
  if (!weatherData.value) return [];
  
  return weatherData.value.forecast.dates.map((date, index) => {
    const d = new Date(date);
    if (index === 0) return 'Today';
    if (index === 1) return 'Tomorrow';
    
    // Format as "Mon, Dec 9"
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    };
    return d.toLocaleDateString('en-US', options);
  });
});

const todayDateFormatted = computed(() => {
  if (!weatherData.value) return '';
  const date = new Date(weatherData.value.forecast.dates[0]);
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric',
    year: 'numeric'
  };
  return date.toLocaleDateString('en-US', options);
});

// Methods
const handleSearchInput = async () => {
  const query = searchQuery.value.trim();
  
  if (query.length < 2) {
    searchResults.value = [];
    showDropdown.value = false;
    return;
  }
  
  isSearching.value = true;
  showDropdown.value = true;
  
  try {
    const results = await searchCities(query);
    searchResults.value = results;
  } catch (err) {
    console.error('City search error:', err);
    searchResults.value = [];
  } finally {
    isSearching.value = false;
  }
};

const selectCity = async (city: GeocodingResult) => {
  selectedCity.value = city;
  searchQuery.value = city.name;
  showDropdown.value = false;
  searchResults.value = [];
  
  await fetchWeather();
};

const fetchWeather = async () => {
  if (!selectedCity.value) return;
  
  isLoading.value = true;
  error.value = null;
  
  try {
    const result = await getWeatherForLocation(selectedCity.value);
    
    if (result.error) {
      error.value = result.error;
      weatherData.value = null;
    } else {
      weatherData.value = result.data;
      lastUpdated.value = new Date();
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to fetch weather data';
    console.error('Weather fetch error:', err);
    weatherData.value = null;
  } finally {
    isLoading.value = false;
  }
};

const handleRefresh = async () => {
  if (selectedCity.value) {
    await fetchWeather();
  }
};

const setupAutoRefresh = () => {
  // Clear existing timer
  if (refreshTimer.value !== null) {
    window.clearInterval(refreshTimer.value);
  }
  
  // Set up new timer
  refreshTimer.value = window.setInterval(() => {
    if (selectedCity.value && !isLoading.value) {
      fetchWeather();
    }
  }, props.refreshInterval);
};

// Lifecycle Hooks
onMounted(() => {
  // Load default city if provided
  if (props.defaultCity) {
    selectedCity.value = {
      id: 0,
      name: props.defaultCity.name,
      latitude: props.defaultCity.latitude,
      longitude: props.defaultCity.longitude,
      country: '',
    };
    fetchWeather();
  }
  
  // Set up auto-refresh
  setupAutoRefresh();
  
  // Close dropdown when clicking outside
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  // Clean up timer
  if (refreshTimer.value !== null) {
    window.clearInterval(refreshTimer.value);
  }
  
  // Remove event listener
  document.removeEventListener('click', handleClickOutside);
});

// Watch for refresh interval changes
watch(() => props.refreshInterval, () => {
  setupAutoRefresh();
});

// Handle clicks outside dropdown
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.weather-widget')) {
    showDropdown.value = false;
  }
};
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

<template>
  <WidgetErrorBoundary>
    <div class="weather-widget bg-white rounded-2xl shadow-lg p-6 border border-gray-300">
      <!-- Header with Title and Refresh -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-3xl font-bold text-gray-900">Weather</h2>
        <div class="text-sm text-gray-600">
          <span v-if="lastUpdated">
            Updated {{ lastUpdatedText }}
          </span>
          <button
            @click="handleRefresh"
            :disabled="isLoading"
            class="ml-2 text-blue-600 hover:underline disabled:opacity-50"
            aria-label="Refresh weather data"
          >
            Refresh
          </button>
        </div>
      </div>

      <!-- City Search Autocomplete -->
      <div ref="searchContainer" class="mb-6 relative">
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
      <div v-if="selectedCity" class="mb-6 flex items-start gap-2">
        <span class="text-2xl">📍</span>
        <div>
          <p class="text-2xl font-bold text-gray-900">{{ selectedCity.name }}</p>
          <p class="text-sm text-gray-600">{{ selectedCity.admin1 }}, {{ selectedCity.country }}</p>
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
        <div class="mb-6">
          <p class="text-lg text-gray-900 mb-4">{{ todayDateFormatted }}</p>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-6">
              <div class="text-8xl">
                {{ currentWeatherIcon }}
              </div>
              <div>
                <p class="text-3xl font-bold text-gray-900 leading-tight">{{ currentWeatherText }}</p>
              </div>
            </div>
            <div class="flex flex-col items-end">
              <p class="text-7xl font-bold text-gray-900 leading-none">{{ Math.round(weatherData.forecast.maxTemperatures[0]) }}°</p>
              <p class="text-5xl font-semibold text-gray-600 leading-none mt-2">{{ Math.round(weatherData.forecast.minTemperatures[0]) }}°</p>
            </div>
          </div>
        </div>

        <!-- 7-Day Forecast Chart -->
        <div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">📊 7-Day Forecast</h3>
          <div class="bg-white rounded-lg p-4 border border-gray-200">
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
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16 px-4">
        <div class="text-6xl mb-4">🌤️</div>
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
const searchContainer = ref<HTMLElement | null>(null);

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
    if (import.meta.env.DEV) {
      console.error('City search error:', err);
    }
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
    if (import.meta.env.DEV) {
      console.error('Weather fetch error:', err);
    }
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
  // Close dropdown if click is outside the search container
  if (searchContainer.value && !searchContainer.value.contains(target)) {
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

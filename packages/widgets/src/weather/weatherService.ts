/**
 * Weather Widget Service
 * 
 * Handles API calls to Open-Meteo for geocoding and weather data.
 * 
 * TODO (Week 3+): Migrate to backend proxy endpoint for:
 * - Caching (reduce API calls)
 * - Rate limiting (per user/IP)
 * - Analytics (track popular locations)
 * See Issue #9 for implementation.
 */

import type {
  GeocodingResponse,
  GeocodingResult,
  WeatherResponse,
  ProcessedWeatherData,
} from './weatherTypes'
import { getWeatherInfo } from './weatherTypes'
import type { WidgetData } from '@dashboardized/types'

// API base URLs (can be overridden via environment variables)
const GEOCODING_API_BASE = import.meta.env.VITE_GEOCODING_API_BASE || 'https://geocoding-api.open-meteo.com'
const WEATHER_API_BASE = import.meta.env.VITE_WEATHER_API_BASE || 'https://api.open-meteo.com'

/**
 * Search for cities using Open-Meteo Geocoding API
 * 
 * @param query - City name to search for
 * @param count - Maximum number of results (default: 5)
 * @returns Array of matching cities
 */
export async function searchCities(
  query: string,
  count: number = 5
): Promise<GeocodingResult[]> {
  if (!query || query.trim().length < 2) {
    return []
  }

  try {
    const url = new URL(`${GEOCODING_API_BASE}/v1/search`)
    url.searchParams.set('name', query.trim())
    url.searchParams.set('count', count.toString())
    url.searchParams.set('language', 'en')
    url.searchParams.set('format', 'json')

    const response = await fetch(url.toString())
    
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status} ${response.statusText}`)
    }

    const data: GeocodingResponse = await response.json()
    return data.results || []
  } catch (error) {
    console.error('Error searching cities:', error)
    throw new Error('Failed to search for cities. Please try again.')
  }
}

/**
 * Debounce function for search input
 * 
 * @param func - Function to debounce
 * @param wait - Milliseconds to wait (default: 300ms)
 * @returns Debounced function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number = 300
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Fetch weather data for a specific location
 * 
 * @param latitude - Location latitude
 * @param longitude - Location longitude
 * @returns Weather forecast data
 */
export async function fetchWeatherData(
  latitude: number,
  longitude: number
): Promise<WeatherResponse> {
  try {
    const url = new URL(`${WEATHER_API_BASE}/v1/forecast`)
    url.searchParams.set('latitude', latitude.toString())
    url.searchParams.set('longitude', longitude.toString())
    url.searchParams.set('current', 'temperature_2m,weather_code')
    url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,weather_code')
    url.searchParams.set('timezone', 'auto')
    url.searchParams.set('forecast_days', '7')

    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`)
    }

    const data: WeatherResponse = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching weather data:', error)
    throw new Error('Failed to fetch weather data. Please try again.')
  }
}

/**
 * Process raw weather API response into usable format
 * 
 * @param location - Selected city information
 * @param weatherData - Raw API response
 * @returns Processed weather data
 */
export function processWeatherData(
  location: GeocodingResult,
  weatherData: WeatherResponse
): ProcessedWeatherData {
  if (!weatherData.current || !weatherData.daily) {
    throw new Error('Invalid weather data received')
  }

  const weatherInfo = getWeatherInfo(weatherData.current.weather_code)

  return {
    location: {
      name: location.name,
      country: location.country,
      latitude: location.latitude,
      longitude: location.longitude,
    },
    current: {
      temperature: Math.round(weatherData.current.temperature_2m),
      weatherCode: weatherData.current.weather_code,
      weatherDescription: weatherInfo.description,
      time: new Date(weatherData.current.time),
    },
    forecast: {
      dates: weatherData.daily.time,
      maxTemperatures: weatherData.daily.temperature_2m_max.map(Math.round),
      minTemperatures: weatherData.daily.temperature_2m_min.map(Math.round),
      weatherCodes: weatherData.daily.weather_code,
    },
    fetchedAt: Date.now(),
  }
}

/**
 * Complete weather data fetch for a location
 * Combines geocoding result with weather data
 * 
 * @param location - Selected city from geocoding
 * @returns Standardized widget data
 */
export async function getWeatherForLocation(
  location: GeocodingResult
): Promise<WidgetData<ProcessedWeatherData>> {
  try {
    const weatherData = await fetchWeatherData(location.latitude, location.longitude)
    const processedData = processWeatherData(location, weatherData)

    return {
      data: processedData,
      timestamp: Date.now(),
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return {
      data: {} as ProcessedWeatherData,
      timestamp: Date.now(),
      error: errorMessage,
    }
  }
}

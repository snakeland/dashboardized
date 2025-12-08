/**
 * Weather Widget Type Definitions
 * 
 * TypeScript interfaces for Open-Meteo API responses and internal data structures.
 */

/**
 * Geocoding API response for city search
 */
export interface GeocodingResult {
  /** Unique city identifier */
  id: number
  /** City name */
  name: string
  /** Latitude coordinate */
  latitude: number
  /** Longitude coordinate */
  longitude: number
  /** Country name */
  country: string
  /** Country code (ISO 3166-1 alpha-2) */
  country_code?: string
  /** State/region name */
  admin1?: string
  /** Additional administrative division */
  admin2?: string
  /** Population count */
  population?: number
  /** Elevation in meters */
  elevation?: number
}

/**
 * Geocoding API response wrapper
 */
export interface GeocodingResponse {
  results?: GeocodingResult[]
  generationtime_ms?: number
}

/**
 * Current weather data from API
 */
export interface CurrentWeather {
  /** Current temperature in Celsius */
  temperature_2m: number
  /** WMO weather code */
  weather_code: number
  /** ISO 8601 timestamp */
  time: string
  /** Wind speed in km/h */
  wind_speed_10m?: number
  /** Wind direction in degrees */
  wind_direction_10m?: number
  /** Relative humidity in % */
  relative_humidity_2m?: number
}

/**
 * Daily weather forecast data
 */
export interface DailyWeather {
  /** Array of dates (ISO 8601) */
  time: string[]
  /** Maximum daily temperature in Celsius */
  temperature_2m_max: number[]
  /** Minimum daily temperature in Celsius */
  temperature_2m_min: number[]
  /** WMO weather code for each day */
  weather_code: number[]
  /** Sunrise time (ISO 8601) */
  sunrise?: string[]
  /** Sunset time (ISO 8601) */
  sunset?: string[]
}

/**
 * Complete weather API response
 */
export interface WeatherResponse {
  latitude: number
  longitude: number
  elevation?: number
  timezone?: string
  timezone_abbreviation?: string
  current?: CurrentWeather
  daily?: DailyWeather
  generationtime_ms?: number
}

/**
 * Processed weather data for component use
 */
export interface ProcessedWeatherData {
  location: {
    name: string
    country: string
    latitude: number
    longitude: number
  }
  current: {
    temperature: number
    weatherCode: number
    weatherDescription: string
    time: Date
  }
  forecast: {
    dates: string[]
    maxTemperatures: number[]
    minTemperatures: number[]
    weatherCodes: number[]
  }
  fetchedAt: number
}

/**
 * Weather widget props
 */
export interface WeatherWidgetProps {
  /** Initial city to display (optional) */
  initialCity?: string
  /** Refresh interval in milliseconds (default: 30 minutes) */
  refreshInterval?: number
}

/**
 * WMO Weather interpretation codes
 * Source: https://open-meteo.com/en/docs
 */
export const WeatherCodeMap: Record<number, { description: string; icon: string }> = {
  0: { description: 'Clear sky', icon: '☀️' },
  1: { description: 'Mainly clear', icon: '🌤️' },
  2: { description: 'Partly cloudy', icon: '⛅' },
  3: { description: 'Overcast', icon: '☁️' },
  45: { description: 'Fog', icon: '🌫️' },
  48: { description: 'Depositing rime fog', icon: '🌫️' },
  51: { description: 'Light drizzle', icon: '🌦️' },
  53: { description: 'Moderate drizzle', icon: '🌦️' },
  55: { description: 'Dense drizzle', icon: '🌧️' },
  56: { description: 'Light freezing drizzle', icon: '🌧️' },
  57: { description: 'Dense freezing drizzle', icon: '🌧️' },
  61: { description: 'Slight rain', icon: '🌧️' },
  63: { description: 'Moderate rain', icon: '🌧️' },
  65: { description: 'Heavy rain', icon: '🌧️' },
  66: { description: 'Light freezing rain', icon: '🌧️' },
  67: { description: 'Heavy freezing rain', icon: '🌧️' },
  71: { description: 'Slight snow', icon: '🌨️' },
  73: { description: 'Moderate snow', icon: '🌨️' },
  75: { description: 'Heavy snow', icon: '🌨️' },
  77: { description: 'Snow grains', icon: '🌨️' },
  80: { description: 'Slight rain showers', icon: '🌦️' },
  81: { description: 'Moderate rain showers', icon: '🌧️' },
  82: { description: 'Violent rain showers', icon: '🌧️' },
  85: { description: 'Slight snow showers', icon: '🌨️' },
  86: { description: 'Heavy snow showers', icon: '🌨️' },
  95: { description: 'Thunderstorm', icon: '⛈️' },
  96: { description: 'Thunderstorm with slight hail', icon: '⛈️' },
  99: { description: 'Thunderstorm with heavy hail', icon: '⛈️' },
}

/**
 * Get weather description and icon from weather code
 */
export function getWeatherInfo(code: number): { description: string; icon: string } {
  return WeatherCodeMap[code] || { description: 'Unknown', icon: '❓' }
}

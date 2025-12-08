/**
 * Weather Widget Exports
 * 
 * Main entry point for the weather widget module.
 */

// Export the component (will be created in Step 4)
export { default as WeatherWidget } from './WeatherWidget.vue'

// Export configuration
export { weatherWidgetConfig } from './weatherConfig'

// Export types
export type * from './weatherTypes'

// Export services (for testing and advanced use)
export {
  searchCities,
  fetchWeatherData,
  getWeatherForLocation,
  debounce,
} from './weatherService'

// Export AI summary function
export { aiSummary } from './weatherAI'

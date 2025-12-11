/**
 * Widgets Package Main Entry Point
 * 
 * Exports all available widgets and their configurations.
 */

// Export weather widget
export { WeatherWidget, weatherWidgetConfig, aiSummary as weatherAiSummary } from './weather'
export type * from './weather/weatherTypes'

// Widget registry (will be expanded as more widgets are added)
export const widgets = {
  weather: {
    component: 'WeatherWidget',
    config: 'weatherWidgetConfig'
  }
}

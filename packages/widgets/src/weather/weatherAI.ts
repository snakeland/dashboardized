/**
 * Weather Widget AI Summary Generator
 * 
 * Generates structured summaries of weather data for AI processing.
 */

import type { AISummaryData } from '@dashboardized/types'
import type { ProcessedWeatherData } from './weatherTypes'
import { getWeatherInfo } from './weatherTypes'

/**
 * Generate AI summary from weather data
 * 
 * @param data - Processed weather data
 * @returns Structured summary for AI prompts
 */
export function aiSummary(data: ProcessedWeatherData): AISummaryData {
  if (!data || !data.location || !data.current) {
    return {
      type: 'weather',
      summary: 'No weather data available',
    }
  }

  const { location, current, forecast } = data
  const currentWeather = getWeatherInfo(current.weatherCode)
  
  // Calculate temperature trend
  const avgTemp = forecast.maxTemperatures.reduce((a, b) => a + b, 0) / forecast.maxTemperatures.length
  const tempTrend = avgTemp > current.temperature ? 'warming' : 'cooling'

  // Find extreme temperatures in forecast
  const maxTemp = Math.max(...forecast.maxTemperatures)
  const minTemp = Math.min(...forecast.minTemperatures)

  // Build human-readable summary
  const summary = `
Weather in ${location.name}, ${location.country}:
Current: ${current.temperature}°C, ${currentWeather.description}
7-day outlook: ${minTemp}°C to ${maxTemp}°C (${tempTrend} trend)
`.trim()

  return {
    type: 'weather',
    summary,
    metrics: {
      location: `${location.name}, ${location.country}`,
      currentTemperature: current.temperature,
      currentCondition: currentWeather.description,
      currentIcon: currentWeather.icon,
      forecastMaxTemp: maxTemp,
      forecastMinTemp: minTemp,
      trend: tempTrend,
      forecastDays: forecast.dates.length,
    },
    raw: {
      location,
      current,
      forecast,
    },
  }
}

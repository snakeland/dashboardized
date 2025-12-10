/**
 * Weather AI Summary Tests
 * 
 * Tests AI summary generation from weather data.
 */

import { describe, it, expect } from 'vitest'
import { aiSummary } from '../weatherAI'
import type { ProcessedWeatherData } from '../weatherTypes'

const mockWeatherData: ProcessedWeatherData = {
  location: {
    name: 'New York',
    country: 'United States',
    latitude: 40.7128,
    longitude: -74.006,
  },
  current: {
    temperature: 15,
    weatherCode: 0,
    weatherDescription: 'Clear sky',
    time: new Date('2025-12-10T12:00:00'),
  },
  forecast: {
    dates: ['12/10', '12/11', '12/12', '12/13', '12/14', '12/15', '12/16'],
    maxTemperatures: [18, 20, 22, 19, 17, 21, 23],
    minTemperatures: [10, 12, 14, 11, 9, 13, 15],
    weatherCodes: [0, 1, 2, 3, 45, 61, 80],
  },
  fetchedAt: Date.now(),
}

describe('weatherAI', () => {
  describe('aiSummary', () => {
    it('generates structured summary data', () => {
      const result = aiSummary(mockWeatherData)

      expect(result).toHaveProperty('type', 'weather')
      expect(result).toHaveProperty('summary')
      expect(result).toHaveProperty('metrics')
      expect(result).toHaveProperty('raw')
    })

    it('includes location information in summary', () => {
      const result = aiSummary(mockWeatherData)

      expect(result.summary).toContain('New York')
      expect(result.summary).toContain('United States')
      expect(result.metrics?.location).toBe('New York, United States')
    })

    it('includes current weather conditions', () => {
      const result = aiSummary(mockWeatherData)

      expect(result.summary).toContain('15°C')
      expect(result.summary).toContain('Clear sky')
      expect(result.metrics?.currentTemperature).toBe(15)
      expect(result.metrics?.currentCondition).toBe('Clear sky')
      expect(result.metrics?.currentIcon).toBe('☀️')
    })

    it('calculates forecast temperature range', () => {
      const result = aiSummary(mockWeatherData)

      expect(result.metrics?.forecastMaxTemp).toBe(23)
      expect(result.metrics?.forecastMinTemp).toBe(9)
      expect(result.summary).toContain('9°C to 23°C')
    })

    it('determines warming trend correctly', () => {
      const warmingData: ProcessedWeatherData = {
        ...mockWeatherData,
        current: {
          ...mockWeatherData.current,
          temperature: 10, // Lower than average
        },
      }

      const result = aiSummary(warmingData)

      expect(result.metrics?.trend).toBe('warming')
      expect(result.summary).toContain('warming trend')
    })

    it('determines cooling trend correctly', () => {
      const coolingData: ProcessedWeatherData = {
        ...mockWeatherData,
        current: {
          ...mockWeatherData.current,
          temperature: 25, // Higher than average
        },
      }

      const result = aiSummary(coolingData)

      expect(result.metrics?.trend).toBe('cooling')
      expect(result.summary).toContain('cooling trend')
    })

    it('includes forecast days count', () => {
      const result = aiSummary(mockWeatherData)

      expect(result.metrics?.forecastDays).toBe(7)
    })

    it('includes raw data for detailed analysis', () => {
      const result = aiSummary(mockWeatherData)

      expect(result.raw).toEqual({
        location: mockWeatherData.location,
        current: mockWeatherData.current,
        forecast: mockWeatherData.forecast,
      })
    })

    it('handles missing data gracefully', () => {
      const emptyData = {} as ProcessedWeatherData

      const result = aiSummary(emptyData)

      expect(result.type).toBe('weather')
      expect(result.summary).toBe('No weather data available')
    })

    it('handles missing location gracefully', () => {
      const dataWithoutLocation = {
        ...mockWeatherData,
        location: undefined,
      } as unknown as ProcessedWeatherData

      const result = aiSummary(dataWithoutLocation)

      expect(result.summary).toBe('No weather data available')
    })

    it('handles missing current weather gracefully', () => {
      const dataWithoutCurrent = {
        ...mockWeatherData,
        current: undefined,
      } as unknown as ProcessedWeatherData

      const result = aiSummary(dataWithoutCurrent)

      expect(result.summary).toBe('No weather data available')
    })

    it('generates different summaries for different locations', () => {
      const londonData: ProcessedWeatherData = {
        location: {
          name: 'London',
          country: 'United Kingdom',
          latitude: 51.5074,
          longitude: -0.1278,
        },
        current: {
          temperature: 12,
          weatherCode: 61,
          weatherDescription: 'Slight rain',
          time: new Date('2025-12-10T12:00:00'),
        },
        forecast: {
          dates: ['12/10', '12/11', '12/12', '12/13', '12/14', '12/15', '12/16'],
          maxTemperatures: [14, 13, 15, 16, 14, 15, 13],
          minTemperatures: [8, 9, 10, 11, 9, 10, 8],
          weatherCodes: [61, 63, 61, 3, 2, 1, 61],
        },
        fetchedAt: Date.now(),
      }

      const nyResult = aiSummary(mockWeatherData)
      const londonResult = aiSummary(londonData)

      expect(nyResult.summary).not.toBe(londonResult.summary)
      expect(nyResult.metrics?.location).toBe('New York, United States')
      expect(londonResult.metrics?.location).toBe('London, United Kingdom')
      expect(londonResult.summary).toContain('Slight rain')
    })

    it('handles extreme weather conditions', () => {
      const extremeData: ProcessedWeatherData = {
        location: {
          name: 'Phoenix',
          country: 'United States',
          latitude: 33.4484,
          longitude: -112.074,
        },
        current: {
          temperature: 42,
          weatherCode: 0,
          weatherDescription: 'Clear sky',
          time: new Date('2025-12-10T12:00:00'),
        },
        forecast: {
          dates: ['12/10', '12/11', '12/12', '12/13', '12/14', '12/15', '12/16'],
          maxTemperatures: [43, 44, 45, 44, 43, 42, 41],
          minTemperatures: [30, 31, 32, 31, 30, 29, 28],
          weatherCodes: [0, 0, 0, 0, 0, 0, 0],
        },
        fetchedAt: Date.now(),
      }

      const result = aiSummary(extremeData)

      expect(result.metrics?.forecastMaxTemp).toBe(45)
      expect(result.metrics?.forecastMinTemp).toBe(28)
      expect(result.metrics?.currentTemperature).toBe(42)
    })

    it('provides consistent structure for AI processing', () => {
      const result = aiSummary(mockWeatherData)

      // Ensure all required fields are present
      expect(result).toMatchObject({
        type: expect.any(String),
        summary: expect.any(String),
        metrics: expect.objectContaining({
          location: expect.any(String),
          currentTemperature: expect.any(Number),
          currentCondition: expect.any(String),
          forecastMaxTemp: expect.any(Number),
          forecastMinTemp: expect.any(Number),
          trend: expect.any(String),
          forecastDays: expect.any(Number),
        }),
        raw: expect.any(Object),
      })
    })
  })
})

/**
 * Weather Service Tests
 * 
 * Tests API calls, geocoding, and data processing.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  searchCities,
  fetchWeatherData,
  debounce,
} from '../weatherService'

// Mock fetch globally
global.fetch = vi.fn()

describe('weatherService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('searchCities', () => {
    it('returns empty array for queries less than 2 characters', async () => {
      const result = await searchCities('a')
      expect(result).toEqual([])
      expect(fetch).not.toHaveBeenCalled()
    })

    it('returns empty array for empty query', async () => {
      const result = await searchCities('')
      expect(result).toEqual([])
      expect(fetch).not.toHaveBeenCalled()
    })

    it('trims whitespace from query', async () => {
      const mockResponse = {
        results: [
          {
            id: 1,
            name: 'New York',
            latitude: 40.7128,
            longitude: -74.006,
            country: 'United States',
            admin1: 'New York',
          },
        ],
      }

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      await searchCities('  New York  ')
      
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('name=New+York')
      )
    })

    it('makes API call with correct parameters', async () => {
      const mockResponse = { results: [] }

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      await searchCities('London', 10)
      
      const callUrl = vi.mocked(fetch).mock.calls[0][0] as string
      expect(callUrl).toContain('name=London')
      expect(callUrl).toContain('count=10')
      expect(callUrl).toContain('language=en')
      expect(callUrl).toContain('format=json')
    })

    it('returns cities from successful API response', async () => {
      const mockCities = [
        {
          id: 1,
          name: 'London',
          latitude: 51.5074,
          longitude: -0.1278,
          country: 'United Kingdom',
          admin1: 'England',
        },
        {
          id: 2,
          name: 'London',
          latitude: 42.9834,
          longitude: -81.2497,
          country: 'Canada',
          admin1: 'Ontario',
        },
      ]

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({ results: mockCities }),
      } as Response)

      const result = await searchCities('London')
      
      expect(result).toEqual(mockCities)
      expect(result).toHaveLength(2)
    })

    it('returns empty array when API returns no results', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      } as Response)

      const result = await searchCities('NonExistentCity')
      
      expect(result).toEqual([])
    })

    it('throws error on API failure', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response)

      await expect(searchCities('London')).rejects.toThrow(
        'Failed to search for cities. Please try again.'
      )
    })

    it('throws error on network failure', async () => {
      vi.mocked(fetch).mockRejectedValue(new Error('Network error'))

      await expect(searchCities('London')).rejects.toThrow(
        'Failed to search for cities. Please try again.'
      )
    })
  })

  describe('fetchWeatherData', () => {
    const latitude = 40.7128
    const longitude = -74.006

    it('makes API call with correct coordinates', async () => {
      const mockResponse = {
        latitude,
        longitude,
        timezone: 'America/New_York',
        daily: {
          time: ['2025-12-10', '2025-12-11'],
          temperature_2m_max: [18, 20],
          temperature_2m_min: [10, 12],
          weathercode: [0, 1],
          precipitation_probability_max: [0, 10],
          windspeed_10m_max: [10, 12],
        },
        current_weather: {
          temperature: 15,
          weathercode: 0,
          windspeed: 10,
          time: '2025-12-10T12:00',
        },
      }

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      await fetchWeatherData(latitude, longitude)
      
      const callUrl = vi.mocked(fetch).mock.calls[0][0] as string
      expect(callUrl).toContain(`latitude=${latitude}`)
      expect(callUrl).toContain(`longitude=${longitude}`)
      expect(callUrl).toContain('daily=temperature_2m_max')
      expect(callUrl).toContain('current=temperature_2m')
    })

    it('processes and returns weather data correctly', async () => {
      const mockResponse = {
        latitude,
        longitude,
        timezone: 'America/New_York',
        daily: {
          time: ['2025-12-10', '2025-12-11', '2025-12-12'],
          temperature_2m_max: [18, 20, 22],
          temperature_2m_min: [10, 12, 14],
          weather_code: [0, 1, 2],
        },
        current: {
          temperature_2m: 15,
          weather_code: 0,
          wind_speed_10m: 10,
          time: '2025-12-10T12:00',
        },
      }

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await fetchWeatherData(latitude, longitude)
      
      expect(result.latitude).toBe(latitude)
      expect(result.longitude).toBe(longitude)
      expect(result.timezone).toBe('America/New_York')
      expect(result.daily?.temperature_2m_max).toEqual([18, 20, 22])
      expect(result.daily?.temperature_2m_min).toEqual([10, 12, 14])
      expect(result.daily?.weather_code).toEqual([0, 1, 2])
      expect(result.current?.temperature_2m).toBe(15)
      expect(result.current?.weather_code).toBe(0)
    })

    it('throws error on API failure', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response)

      await expect(fetchWeatherData(latitude, longitude)).rejects.toThrow(
        'Failed to fetch weather data. Please try again.'
      )
    })

    it('throws error on network failure', async () => {
      vi.mocked(fetch).mockRejectedValue(new Error('Network error'))

      await expect(fetchWeatherData(latitude, longitude)).rejects.toThrow(
        'Failed to fetch weather data. Please try again.'
      )
    })

    it('handles missing optional data gracefully', async () => {
      const mockResponse = {
        latitude,
        longitude,
        timezone: 'America/New_York',
        daily: {
          time: ['2025-12-10'],
          temperature_2m_max: [18],
          temperature_2m_min: [10],
          weather_code: [0],
        },
        current: {
          temperature_2m: 15,
          weather_code: 0,
          wind_speed_10m: 10,
          time: '2025-12-10T12:00',
        },
      }

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await fetchWeatherData(latitude, longitude)
      
      expect(result).toBeDefined()
      expect(result.daily?.time).toHaveLength(1)
    })

    it('handles 7-day forecast data', async () => {
      const mockResponse = {
        latitude,
        longitude,
        timezone: 'America/New_York',
        daily: {
          time: ['2025-12-10', '2025-12-11', '2025-12-12', '2025-12-13', '2025-12-14', '2025-12-15', '2025-12-16'],
          temperature_2m_max: [18, 20, 22, 19, 17, 21, 23],
          temperature_2m_min: [10, 12, 14, 11, 9, 13, 15],
          weather_code: [0, 1, 2, 3, 45, 61, 80],
        },
        current: {
          temperature_2m: 15,
          weather_code: 0,
          wind_speed_10m: 10,
          time: '2025-12-10T12:00',
        },
      }

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await fetchWeatherData(latitude, longitude)
      
      expect(result.daily?.time).toHaveLength(7)
      expect(result.daily?.temperature_2m_max).toHaveLength(7)
      expect(result.daily?.temperature_2m_min).toHaveLength(7)
    })
  })

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('delays function execution', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 300)

      debouncedFn()
      expect(mockFn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(299)
      expect(mockFn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(1)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('cancels previous calls within wait period', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 300)

      debouncedFn()
      vi.advanceTimersByTime(100)
      debouncedFn()
      vi.advanceTimersByTime(100)
      debouncedFn()

      vi.advanceTimersByTime(300)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('passes arguments correctly', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 300)

      debouncedFn('arg1', 'arg2', 123)
      vi.advanceTimersByTime(300)

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 123)
    })

    it('uses default wait time of 300ms', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn)

      debouncedFn()
      vi.advanceTimersByTime(299)
      expect(mockFn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(1)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('allows multiple independent debounced functions', () => {
      const mockFn1 = vi.fn()
      const mockFn2 = vi.fn()
      const debouncedFn1 = debounce(mockFn1, 300)
      const debouncedFn2 = debounce(mockFn2, 300)

      debouncedFn1()
      debouncedFn2()

      vi.advanceTimersByTime(300)

      expect(mockFn1).toHaveBeenCalledTimes(1)
      expect(mockFn2).toHaveBeenCalledTimes(1)
    })
  })
})

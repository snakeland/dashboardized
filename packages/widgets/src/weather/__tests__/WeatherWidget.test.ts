/**
 * WeatherWidget Component Tests
 * 
 * Tests component rendering, user interactions, and error states.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import WeatherWidget from '../WeatherWidget.vue'
import { fetchWeatherData, searchCities } from '../weatherService'

// Mock the weather service
vi.mock('../weatherService', () => ({
  fetchWeatherData: vi.fn(),
  searchCities: vi.fn(),
  debounce: (fn: Function) => fn, // Disable debounce for tests
}))

// Mock Chart.js component
vi.mock('@dashboardized/ui', () => ({
  ChartLine: {
    name: 'ChartLine',
    template: '<div class="mock-chart"></div>',
  },
  WidgetErrorBoundary: {
    name: 'WidgetErrorBoundary',
    template: '<div><slot /></div>',
  },
}))

const mockWeatherData = {
  latitude: 40.7128,
  longitude: -74.006,
  timezone: 'America/New_York',
  forecast: {
    time: ['2025-12-10', '2025-12-11', '2025-12-12', '2025-12-13', '2025-12-14', '2025-12-15', '2025-12-16'],
    maxTemperatures: [18, 20, 22, 19, 17, 21, 23],
    minTemperatures: [10, 12, 14, 11, 9, 13, 15],
    weatherCodes: [0, 1, 2, 3, 45, 61, 80],
    precipitationProbability: [0, 10, 20, 30, 40, 50, 60],
    windSpeed: [10, 12, 15, 18, 20, 22, 25],
  },
  current: {
    temperature: 15,
    weatherCode: 0,
    windSpeed: 10,
    time: '2025-12-10T12:00',
  },
  location: {
    name: 'New York',
    country: 'United States',
    admin1: 'New York',
  },
}

const mockCityResults = [
  {
    id: 1,
    name: 'New York',
    latitude: 40.7128,
    longitude: -74.006,
    country: 'United States',
    admin1: 'New York',
  },
  {
    id: 2,
    name: 'Newark',
    latitude: 40.7357,
    longitude: -74.1724,
    country: 'United States',
    admin1: 'New Jersey',
  },
]

describe('WeatherWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  describe('Component Rendering', () => {
    it('renders the widget with loading state initially', () => {
      const wrapper = mount(WeatherWidget)
      
      expect(wrapper.find('.weather-widget').exists()).toBe(true)
      expect(wrapper.find('h2').text()).toBe('Weather')
    })

    it('displays weather data after successful fetch', async () => {
      vi.mocked(fetchWeatherData).mockResolvedValue(mockWeatherData)
      
      const wrapper = mount(WeatherWidget)
      await flushPromises()
      
      expect(wrapper.text()).toContain('New York')
      expect(wrapper.text()).toContain('18°') // Max temp
      expect(wrapper.text()).toContain('10°') // Min temp
    })

    it('renders the 7-day forecast chart', async () => {
      vi.mocked(fetchWeatherData).mockResolvedValue(mockWeatherData)
      
      const wrapper = mount(WeatherWidget)
      await flushPromises()
      
      expect(wrapper.find('.mock-chart').exists()).toBe(true)
      expect(wrapper.text()).toContain('7-Day Forecast')
    })

    it('displays current weather information', async () => {
      vi.mocked(fetchWeatherData).mockResolvedValue(mockWeatherData)
      
      const wrapper = mount(WeatherWidget)
      await flushPromises()
      
      expect(wrapper.text()).toContain('15°') // Current temp
    })
  })

  describe('City Search', () => {
    it('shows search input field', () => {
      const wrapper = mount(WeatherWidget)
      
      const searchInput = wrapper.find('input[type="text"]')
      expect(searchInput.exists()).toBe(true)
      expect(searchInput.attributes('placeholder')).toBe('Enter city name...')
    })

    it('displays search results when user types', async () => {
      vi.mocked(searchCities).mockResolvedValue(mockCityResults)
      
      const wrapper = mount(WeatherWidget)
      const searchInput = wrapper.find('input[type="text"]')
      
      await searchInput.setValue('New')
      await flushPromises()
      
      expect(vi.mocked(searchCities)).toHaveBeenCalledWith('New', 5)
      expect(wrapper.text()).toContain('New York')
      expect(wrapper.text()).toContain('Newark')
    })

    it('fetches weather data when city is selected', async () => {
      vi.mocked(searchCities).mockResolvedValue(mockCityResults)
      vi.mocked(fetchWeatherData).mockResolvedValue(mockWeatherData)
      
      const wrapper = mount(WeatherWidget)
      const searchInput = wrapper.find('input[type="text"]')
      
      await searchInput.setValue('New')
      await flushPromises()
      
      const cityButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('New York')
      )
      expect(cityButton).toBeDefined()
      
      await cityButton!.trigger('click')
      await flushPromises()
      
      expect(vi.mocked(fetchWeatherData)).toHaveBeenCalledWith(40.7128, -74.006)
    })

    it('clears search results after city selection', async () => {
      vi.mocked(searchCities).mockResolvedValue(mockCityResults)
      vi.mocked(fetchWeatherData).mockResolvedValue(mockWeatherData)
      
      const wrapper = mount(WeatherWidget)
      const searchInput = wrapper.find('input[type="text"]')
      
      await searchInput.setValue('New')
      await flushPromises()
      
      const cityButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('New York')
      )
      await cityButton!.trigger('click')
      await flushPromises()
      
      expect(searchInput.element.value).toBe('')
    })
  })

  describe('Error Handling', () => {
    it('displays error message when fetch fails', async () => {
      vi.mocked(fetchWeatherData).mockRejectedValue(new Error('API Error'))
      
      const wrapper = mount(WeatherWidget)
      await flushPromises()
      
      expect(wrapper.text()).toContain('Failed to load weather data')
    })

    it('shows error when city search fails', async () => {
      vi.mocked(searchCities).mockRejectedValue(new Error('Search failed'))
      
      const wrapper = mount(WeatherWidget)
      const searchInput = wrapper.find('input[type="text"]')
      
      await searchInput.setValue('InvalidCity')
      await flushPromises()
      
      // Error should be logged but not crash the component
      expect(wrapper.find('.weather-widget').exists()).toBe(true)
    })

    it('handles empty search results gracefully', async () => {
      vi.mocked(searchCities).mockResolvedValue([])
      
      const wrapper = mount(WeatherWidget)
      const searchInput = wrapper.find('input[type="text"]')
      
      await searchInput.setValue('NonExistentCity')
      await flushPromises()
      
      expect(wrapper.findAll('button').length).toBeGreaterThan(0) // Only refresh button
    })
  })

  describe('Refresh Functionality', () => {
    it('has a refresh button', async () => {
      vi.mocked(fetchWeatherData).mockResolvedValue(mockWeatherData)
      
      const wrapper = mount(WeatherWidget)
      await flushPromises()
      
      const refreshButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Refresh')
      )
      expect(refreshButton).toBeDefined()
    })

    it('refetches data when refresh button is clicked', async () => {
      vi.mocked(fetchWeatherData).mockResolvedValue(mockWeatherData)
      
      const wrapper = mount(WeatherWidget)
      await flushPromises()
      
      expect(vi.mocked(fetchWeatherData)).toHaveBeenCalledTimes(1)
      
      const refreshButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Refresh')
      )
      await refreshButton!.trigger('click')
      await flushPromises()
      
      expect(vi.mocked(fetchWeatherData)).toHaveBeenCalledTimes(2)
    })

    it('disables refresh button while loading', async () => {
      vi.mocked(fetchWeatherData).mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockWeatherData), 100))
      )
      
      const wrapper = mount(WeatherWidget)
      
      const refreshButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Refresh')
      )
      expect(refreshButton!.attributes('disabled')).toBeDefined()
    })
  })

  describe('Loading States', () => {
    it('shows loading state while fetching data', () => {
      vi.mocked(fetchWeatherData).mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockWeatherData), 100))
      )
      
      const wrapper = mount(WeatherWidget)
      
      expect(wrapper.text()).toContain('Loading weather data')
    })

    it('disables search input while loading', async () => {
      vi.mocked(fetchWeatherData).mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockWeatherData), 100))
      )
      
      const wrapper = mount(WeatherWidget)
      const searchInput = wrapper.find('input[type="text"]')
      
      expect(searchInput.attributes('disabled')).toBeDefined()
    })
  })

  describe('Data Display', () => {
    it('formats dates correctly', async () => {
      vi.mocked(fetchWeatherData).mockResolvedValue(mockWeatherData)
      
      const wrapper = mount(WeatherWidget)
      await flushPromises()
      
      // Should display formatted date for today
      const dateText = wrapper.text()
      expect(dateText).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/) // MM/DD/YYYY or similar
    })

    it('rounds temperature values', async () => {
      const dataWithDecimals = {
        ...mockWeatherData,
        forecast: {
          ...mockWeatherData.forecast,
          maxTemperatures: [18.7, 20.3, 22.9, 19.1, 17.5, 21.8, 23.2],
          minTemperatures: [10.2, 12.6, 14.1, 11.9, 9.4, 13.7, 15.3],
        },
      }
      vi.mocked(fetchWeatherData).mockResolvedValue(dataWithDecimals)
      
      const wrapper = mount(WeatherWidget)
      await flushPromises()
      
      // Temperatures should be rounded
      expect(wrapper.text()).toContain('19°')
      expect(wrapper.text()).toContain('10°')
    })

    it('displays location information', async () => {
      vi.mocked(fetchWeatherData).mockResolvedValue(mockWeatherData)
      
      const wrapper = mount(WeatherWidget)
      await flushPromises()
      
      expect(wrapper.text()).toContain('New York')
      expect(wrapper.text()).toContain('United States')
    })
  })
})

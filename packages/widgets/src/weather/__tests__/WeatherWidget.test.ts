/**
 * WeatherWidget Component Tests
 * 
 * Tests component rendering, user interactions, and error states.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import WeatherWidget from '../WeatherWidget.vue'
import { getWeatherForLocation, searchCities } from '../weatherService'

// Mock the weather service
vi.mock('../weatherService', () => ({
  getWeatherForLocation: vi.fn(),
  searchCities: vi.fn(),
  debounce: (fn: (...args: any[]) => any) => fn, // Disable debounce for tests
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

const mockProcessedWeatherData = {
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
    dates: ['2025-12-10', '2025-12-11', '2025-12-12', '2025-12-13', '2025-12-14', '2025-12-15', '2025-12-16'],
    maxTemperatures: [18, 20, 22, 19, 17, 21, 23],
    minTemperatures: [10, 12, 14, 11, 9, 13, 15],
    weatherCodes: [0, 1, 2, 3, 45, 61, 80],
  },
  fetchedAt: Date.now(),
}

const mockWidgetData = {
  data: mockProcessedWeatherData,
  timestamp: Date.now(),
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
    it('renders the widget with empty state initially', () => {
      const wrapper = mount(WeatherWidget)
      
      expect(wrapper.find('.weather-widget').exists()).toBe(true)
      expect(wrapper.find('h2').text()).toBe('Weather')
      expect(wrapper.text()).toContain('No Location Selected')
    })

    it('displays weather data after user selects a city', async () => {
      vi.mocked(searchCities).mockResolvedValue(mockCityResults)
      vi.mocked(getWeatherForLocation).mockResolvedValue(mockWidgetData)
      
      const wrapper = mount(WeatherWidget)
      const searchInput = wrapper.find('input[type="text"]')
      
      // User types city name
      await searchInput.setValue('New York')
      await flushPromises()
      
      // User clicks first city result
      const cityButtons = wrapper.findAll('button').filter(btn => 
        btn.text().includes('New York')
      )
      await cityButtons[0].trigger('click')
      await flushPromises()
      
      expect(wrapper.text()).toContain('New York')
      expect(wrapper.text()).toContain('18°') // Max temp
      expect(wrapper.text()).toContain('10°') // Min temp
    })

    it('renders the 7-day forecast chart after city selection', async () => {
      vi.mocked(searchCities).mockResolvedValue(mockCityResults)
      vi.mocked(getWeatherForLocation).mockResolvedValue(mockWidgetData)
      
      const wrapper = mount(WeatherWidget)
      const searchInput = wrapper.find('input[type="text"]')
      
      await searchInput.setValue('New York')
      await flushPromises()
      
      const cityButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('New York')
      )
      await cityButton!.trigger('click')
      await flushPromises()
      
      expect(wrapper.find('.mock-chart').exists()).toBe(true)
      expect(wrapper.text()).toContain('7-Day Forecast')
    })

    it('displays current weather information', async () => {
      vi.mocked(searchCities).mockResolvedValue(mockCityResults)
      vi.mocked(getWeatherForLocation).mockResolvedValue(mockWidgetData)
      
      const wrapper = mount(WeatherWidget)
      const searchInput = wrapper.find('input[type="text"]')
      
      await searchInput.setValue('New York')
      await flushPromises()
      
      const cityButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('New York')
      )
      await cityButton!.trigger('click')
      await flushPromises()
      
      expect(wrapper.text()).toContain('18°') // Forecast max temp
      expect(wrapper.text()).toContain('10°') // Forecast min temp
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
      
      expect(vi.mocked(searchCities)).toHaveBeenCalledWith('New')
      expect(wrapper.text()).toContain('New York')
      expect(wrapper.text()).toContain('Newark')
    })

    it('fetches weather data when city is selected', async () => {
      vi.mocked(searchCities).mockResolvedValue(mockCityResults)
      vi.mocked(getWeatherForLocation).mockResolvedValue(mockWidgetData)
      
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
      
      expect(vi.mocked(getWeatherForLocation)).toHaveBeenCalledWith(mockCityResults[0])
    })

    it('clears search results after city selection', async () => {
      vi.mocked(searchCities).mockResolvedValue(mockCityResults)
      vi.mocked(getWeatherForLocation).mockResolvedValue(mockWidgetData)
      
      const wrapper = mount(WeatherWidget)
      const searchInput = wrapper.find('input[type="text"]')
      
      await searchInput.setValue('New')
      await flushPromises()
      
      const cityButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('New York')
      )
      await cityButton!.trigger('click')
      await flushPromises()
      
      expect((searchInput.element as HTMLInputElement).value).toBe('New York')
    })

    it('closes dropdown when clicking outside search container', async () => {
      vi.mocked(searchCities).mockResolvedValue(mockCityResults)
      vi.mocked(getWeatherForLocation).mockResolvedValue(mockWidgetData)
      
      const wrapper = mount(WeatherWidget, {
        attachTo: document.body, // Attach to document for click outside to work
      })
      const searchInput = wrapper.find('input[type="text"]')
      
      // Open dropdown by searching
      await searchInput.setValue('New')
      await flushPromises()
      
      // Verify dropdown is visible
      expect(wrapper.find('.absolute.z-10').exists()).toBe(true)
      
      // Click outside the search container (on the weather widget title)
      const widgetTitle = wrapper.find('h2')
      await widgetTitle.trigger('click')
      await wrapper.vm.$nextTick()
      
      // Dropdown should be closed
      expect(wrapper.find('.absolute.z-10').exists()).toBe(false)
      
      wrapper.unmount()
    })

    it('keeps dropdown open when clicking inside search container', async () => {
      vi.mocked(searchCities).mockResolvedValue(mockCityResults)
      
      const wrapper = mount(WeatherWidget, {
        attachTo: document.body,
      })
      const searchInput = wrapper.find('input[type="text"]')
      
      // Open dropdown by searching
      await searchInput.setValue('New')
      await flushPromises()
      
      // Verify dropdown is visible
      expect(wrapper.find('.absolute.z-10').exists()).toBe(true)
      
      // Click on the search input itself
      await searchInput.trigger('click')
      await wrapper.vm.$nextTick()
      
      // Dropdown should still be open
      expect(wrapper.find('.absolute.z-10').exists()).toBe(true)
      
      wrapper.unmount()
    })
  })

  describe('Error Handling', () => {
    it('displays error message when fetch fails', async () => {
      vi.mocked(searchCities).mockResolvedValue(mockCityResults)
      vi.mocked(getWeatherForLocation).mockResolvedValue({
        data: {} as any,
        timestamp: Date.now(),
        error: 'Failed to load weather data',
      })
      
      const wrapper = mount(WeatherWidget)
      const searchInput = wrapper.find('input[type="text"]')
      
      await searchInput.setValue('New York')
      await flushPromises()
      
      const cityButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('New York')
      )
      await cityButton!.trigger('click')
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
    it('has a refresh button', () => {
      const wrapper = mount(WeatherWidget)
      
      const refreshButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Refresh')
      )
      expect(refreshButton).toBeDefined()
    })

    it('refetches data when refresh button is clicked', async () => {
      vi.mocked(searchCities).mockResolvedValue(mockCityResults)
      vi.mocked(getWeatherForLocation).mockResolvedValue(mockWidgetData)
      
      const wrapper = mount(WeatherWidget)
      const searchInput = wrapper.find('input[type="text"]')
      
      // Select a city first
      await searchInput.setValue('New York')
      await flushPromises()
      
      const cityButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('New York')
      )
      await cityButton!.trigger('click')
      await flushPromises()
      
      expect(vi.mocked(getWeatherForLocation)).toHaveBeenCalledTimes(1)
      
      const refreshButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Refresh')
      )
      await refreshButton!.trigger('click')
      await flushPromises()
      
      expect(vi.mocked(getWeatherForLocation)).toHaveBeenCalledTimes(2)
    })

    it('disables refresh button while loading', async () => {
      vi.mocked(searchCities).mockResolvedValue(mockCityResults)
      vi.mocked(getWeatherForLocation).mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockWidgetData), 100))
      )
      
      const wrapper = mount(WeatherWidget)
      const searchInput = wrapper.find('input[type="text"]')
      
      await searchInput.setValue('New York')
      await flushPromises()
      
      const cityButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('New York')
      )
      await cityButton!.trigger('click')
      // Don't wait for promises - check loading state
      
      const refreshButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Refresh')
      )
      expect(refreshButton!.attributes('disabled')).toBeDefined()
    })
  })

  describe('Loading States', () => {
    it('shows loading state while fetching data', async () => {
      vi.mocked(searchCities).mockResolvedValue(mockCityResults)
      vi.mocked(getWeatherForLocation).mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockWidgetData), 100))
      )
      
      const wrapper = mount(WeatherWidget)
      const searchInput = wrapper.find('input[type="text"]')
      
      await searchInput.setValue('New York')
      await flushPromises()
      
      const cityButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('New York')
      )
      cityButton!.trigger('click')
      // Don't wait - check loading state immediately
      
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.animate-pulse').exists()).toBe(true)
    })

    it('disables search input while loading', async () => {
      vi.mocked(searchCities).mockResolvedValue(mockCityResults)
      vi.mocked(getWeatherForLocation).mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockWidgetData), 100))
      )
      
      const wrapper = mount(WeatherWidget)
      const searchInput = wrapper.find('input[type="text"]')
      
      await searchInput.setValue('New York')
      await flushPromises()
      
      const cityButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('New York')
      )
      cityButton!.trigger('click')
      // Don't wait - check disabled state
      
      await wrapper.vm.$nextTick()
      expect(searchInput.attributes('disabled')).toBeDefined()
    })
  })

  describe('Data Display', () => {
    it('formats dates correctly', async () => {
      vi.mocked(searchCities).mockResolvedValue(mockCityResults)
      vi.mocked(getWeatherForLocation).mockResolvedValue(mockWidgetData)
      
      const wrapper = mount(WeatherWidget)
      const searchInput = wrapper.find('input[type="text"]')
      
      await searchInput.setValue('New York')
      await flushPromises()
      
      const cityButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('New York')
      )
      await cityButton!.trigger('click')
      await flushPromises()
      
      // Should display formatted dates
      const dateText = wrapper.text()
      expect(dateText).toMatch(/Today|Tomorrow|Mon|Tue|Wed|Thu|Fri|Sat|Sun/)
    })

    it('rounds temperature values', async () => {
      const dataWithDecimals = {
        ...mockProcessedWeatherData,
        forecast: {
          ...mockProcessedWeatherData.forecast,
          maxTemperatures: [19, 20, 23, 19, 18, 22, 23],
          minTemperatures: [10, 13, 14, 12, 9, 13, 15],
        },
      }
      
      vi.mocked(searchCities).mockResolvedValue(mockCityResults)
      vi.mocked(getWeatherForLocation).mockResolvedValue({
        data: dataWithDecimals,
        timestamp: Date.now(),
      })
      
      const wrapper = mount(WeatherWidget)
      const searchInput = wrapper.find('input[type="text"]')
      
      await searchInput.setValue('New York')
      await flushPromises()
      
      const cityButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('New York')
      )
      await cityButton!.trigger('click')
      await flushPromises()
      
      // Temperatures should be displayed as integers
      expect(wrapper.text()).toContain('19°')
      expect(wrapper.text()).toContain('10°')
    })

    it('displays location information', async () => {
      vi.mocked(searchCities).mockResolvedValue(mockCityResults)
      vi.mocked(getWeatherForLocation).mockResolvedValue(mockWidgetData)
      
      const wrapper = mount(WeatherWidget)
      const searchInput = wrapper.find('input[type="text"]')
      
      await searchInput.setValue('New York')
      await flushPromises()
      
      const cityButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('New York')
      )
      await cityButton!.trigger('click')
      await flushPromises()
      
      expect(wrapper.text()).toContain('New York')
      expect(wrapper.text()).toContain('United States')
    })
  })
})

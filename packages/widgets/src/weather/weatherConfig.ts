/**
 * Weather Widget Configuration
 * 
 * Widget metadata and configuration implementing the WidgetConfig interface.
 */

import type { WidgetConfig } from '@dashboardized/types'

export const weatherWidgetConfig: WidgetConfig = {
  id: 'weather',
  name: 'Weather',
  description: '7-day weather forecast with current conditions and temperature trends',
  icon: '🌤️',
  category: 'environment',
  defaultProps: {
    refreshInterval: 30 * 60 * 1000, // 30 minutes in milliseconds
  },
}

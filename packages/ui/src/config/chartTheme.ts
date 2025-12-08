/**
 * Shared Chart.js Theme Configuration
 * 
 * Provides consistent styling across all charts in the application.
 * Uses TailwindCSS color palette for consistency with the design system.
 */

import type { ChartOptions } from 'chart.js'

/**
 * Color palette for charts (TailwindCSS-inspired)
 */
export const chartColors = {
  primary: '#3b82f6',    // blue-500
  secondary: '#8b5cf6',  // violet-500
  success: '#10b981',    // emerald-500
  warning: '#f59e0b',    // amber-500
  danger: '#ef4444',     // red-500
  info: '#06b6d4',       // cyan-500
  gray: '#6b7280',       // gray-500
  light: '#e5e7eb',      // gray-200
  dark: '#1f2937',       // gray-800
}

/**
 * Chart colors with transparency variants
 */
export const chartColorsAlpha = {
  primary: 'rgba(59, 130, 246, 0.7)',
  primaryLight: 'rgba(59, 130, 246, 0.2)',
  secondary: 'rgba(139, 92, 246, 0.7)',
  secondaryLight: 'rgba(139, 92, 246, 0.2)',
  success: 'rgba(16, 185, 129, 0.7)',
  successLight: 'rgba(16, 185, 129, 0.2)',
  warning: 'rgba(245, 158, 11, 0.7)',
  warningLight: 'rgba(245, 158, 11, 0.2)',
  danger: 'rgba(239, 68, 68, 0.7)',
  dangerLight: 'rgba(239, 68, 68, 0.2)',
}

/**
 * Default font configuration
 */
export const defaultFontConfig = {
  family: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  size: 12,
  weight: '400',
}

/**
 * Shared chart options for consistent styling
 */
export const defaultChartOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        font: {
          ...defaultFontConfig,
        },
        color: chartColors.dark,
        padding: 12,
        usePointStyle: true,
      },
    },
    tooltip: {
      backgroundColor: 'rgba(31, 41, 55, 0.95)', // gray-800 with opacity
      titleColor: '#ffffff',
      bodyColor: '#e5e7eb', // gray-200
      borderColor: chartColors.light,
      borderWidth: 1,
      padding: 12,
      displayColors: true,
      titleFont: {
        ...defaultFontConfig,
        weight: '600',
      },
      bodyFont: {
        ...defaultFontConfig,
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        font: {
          ...defaultFontConfig,
        },
        color: chartColors.gray,
      },
    },
    y: {
      grid: {
        color: chartColors.light,
        drawBorder: false,
      },
      ticks: {
        font: {
          ...defaultFontConfig,
        },
        color: chartColors.gray,
        padding: 8,
      },
    },
  },
}

/**
 * Helper function to merge custom options with defaults
 */
export function mergeChartOptions(
  customOptions: Partial<ChartOptions> = {}
): ChartOptions {
  return {
    ...defaultChartOptions,
    ...customOptions,
    plugins: {
      ...defaultChartOptions.plugins,
      ...customOptions.plugins,
    },
    scales: {
      ...defaultChartOptions.scales,
      ...customOptions.scales,
    },
  } as ChartOptions
}

/**
 * Widget Type System
 * 
 * Core interfaces for all widgets in the Dashboardized platform.
 * Each widget must implement these interfaces to ensure consistency
 * and enable features like AI summaries and data management.
 * 
 * TODO: Evaluate and refine this interface after implementing 2-3 widgets
 * (weather, news, crypto) to identify common patterns and improvements.
 */

import type { Component } from 'vue'

/**
 * Widget configuration metadata
 */
export interface WidgetConfig {
  /** Unique identifier for the widget */
  id: string
  /** Display name of the widget */
  name: string
  /** Brief description of widget functionality */
  description: string
  /** Optional icon identifier (can be icon name, URL, or component) */
  icon?: string
  /** Category for grouping widgets (e.g., 'weather', 'finance', 'productivity') */
  category?: string
  /** Default props to initialize the widget with */
  defaultProps?: Record<string, unknown>
}

/**
 * Standardized data wrapper for widget responses
 */
export interface WidgetData<T = unknown> {
  /** The actual data payload */
  data: T
  /** Timestamp when data was fetched (Unix timestamp in milliseconds) */
  timestamp: number
  /** Error message if data fetch failed */
  error?: string
}

/**
 * Structured data format for AI summary generation
 */
export interface AISummaryData {
  /** Type/category of data for AI context */
  type: string
  /** Human-readable summary text */
  summary: string
  /** Key metrics extracted from widget data */
  metrics?: Record<string, unknown>
  /** Optional raw data for detailed AI analysis */
  raw?: unknown
}

/**
 * Core widget interface that all widgets must implement
 */
export interface Widget<TData = unknown, TProps = unknown> {
  /** Widget configuration and metadata */
  config: WidgetConfig
  /** Vue component for rendering the widget */
  component: Component
  /** Function to fetch widget data based on props */
  fetchData: (props: TProps) => Promise<WidgetData<TData>>
  /** Function to generate AI summary from widget data */
  aiSummary: (data: TData) => AISummaryData
}

/**
 * Widget registry type for managing all available widgets
 */
export type WidgetRegistry = Record<string, Widget>

// Shared TypeScript types and interfaces

// Widget type system - Core interfaces for all widgets
export type {
  WidgetConfig,
  WidgetData,
  AISummaryData,
  Widget,
  WidgetRegistry,
} from './widget'

// Dashboard configuration
export interface DashboardConfig {
  userId: string
  widgets: string[] // Widget IDs
  layout: unknown
}

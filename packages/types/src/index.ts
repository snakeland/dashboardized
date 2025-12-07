// Shared TypeScript types and interfaces

export interface Widget {
  id: string
  name: string
  type: string
}

export interface WidgetData {
  widgetId: string
  data: unknown
  timestamp: Date
}

export interface DashboardConfig {
  userId: string
  widgets: Widget[]
  layout: unknown
}

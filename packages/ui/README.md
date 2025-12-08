# @dashboardized/ui

Shared UI components library for the Dashboardized platform.

## Overview

This package contains reusable Vue 3 components that are used across the application. Components here are **pure** and should not have direct data dependencies or API calls.

## Dependencies

### Chart.js

This package uses **Chart.js** (v4.x) and **vue-chartjs** (v5.x) for data visualization components.

- **Chart.js**: ^4.5.0
- **vue-chartjs**: ^5.3.0

These are included as regular dependencies since the chart components are core to the UI package.

## Components

### ChartLine

Reusable line chart component with support for:
- Single or dual datasets (e.g., min/max values)
- Highlight specific data points (e.g., current day)
- Customizable styling via theme configuration
- Responsive design

**Usage:**
```vue
<script setup>
import { ChartLine } from '@dashboardized/ui'

const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const temperatures = [18, 20, 22, 21, 19, 17, 16]
const highlightToday = 3 // Thursday
</script>

<template>
  <ChartLine
    :labels="labels"
    :data="temperatures"
    data-label="Temperature (°C)"
    :highlight-index="highlightToday"
    :height="300"
  />
</template>
```

### WidgetErrorBoundary

Error boundary component for graceful error handling in widgets.

**Usage:**
```vue
<WidgetErrorBoundary widget-name="Weather Widget">
  <WeatherWidget />
</WidgetErrorBoundary>
```

## Chart Theme

Shared Chart.js theme configuration providing consistent styling across all charts.

**Colors:**
- Primary: #3b82f6 (blue-500)
- Secondary: #8b5cf6 (violet-500)
- Success: #10b981 (emerald-500)
- Warning: #f59e0b (amber-500)
- Danger: #ef4444 (red-500)

**Usage:**
```typescript
import { chartColors, mergeChartOptions } from '@dashboardized/ui'

const customOptions = mergeChartOptions({
  plugins: {
    title: {
      display: true,
      text: 'My Custom Chart'
    }
  }
})
```

## Development

```bash
# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Lint code
pnpm lint
```

## Guidelines

- Components should be **pure** - no direct API calls or global state mutations
- Use TypeScript for type safety
- Write tests for all components
- Follow TailwindCSS utility-first approach for styling
- Document props and usage in component files

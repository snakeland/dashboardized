# Weather Widget

Displays current weather conditions and 7-day temperature forecast with autocomplete city search.

## Features

- **City Search**: Autocomplete dropdown with Open-Meteo Geocoding API
- **Current Weather**: Temperature (Celsius) and condition icon/text
- **7-Day Forecast**: Line chart showing daily max and min temperatures
- **Current Day Highlight**: Visual indicator for today's forecast
- **Auto-Refresh**: Updates every 30 minutes automatically
- **Manual Refresh**: Button to force immediate update
- **Last Updated**: Timestamp showing when data was last fetched

## API Dependencies

### Open-Meteo Geocoding API
- **Endpoint**: `https://geocoding-api.open-meteo.com/v1/search`
- **Purpose**: City name autocomplete
- **Authentication**: None required (free, public API)
- **Rate Limit**: Generous (no strict limits documented)

### Open-Meteo Weather API
- **Endpoint**: `https://api.open-meteo.com/v1/forecast`
- **Purpose**: Weather data and 7-day forecast
- **Authentication**: None required (free, public API)
- **Rate Limit**: 10,000 requests/day (free tier)

Both APIs are **free** and **require no API key**.

## Environment Variables

### Optional Configuration

```env
# Base URL for weather API (default: https://api.open-meteo.com)
VITE_WEATHER_API_BASE=https://api.open-meteo.com

# Base URL for geocoding API (default: https://geocoding-api.open-meteo.com)
VITE_GEOCODING_API_BASE=https://geocoding-api.open-meteo.com
```

## Usage

```vue
<script setup>
import { WeatherWidget } from '@dashboardized/widgets/weather'
</script>

<template>
  <WeatherWidget />
</template>
```

## Data Structure

### Geocoding Response
```typescript
interface GeocodingResult {
  id: number
  name: string
  latitude: number
  longitude: number
  country: string
  admin1?: string // State/region
}
```

### Weather Response
```typescript
interface WeatherData {
  current: {
    temperature: number
    weatherCode: number
    time: string
  }
  daily: {
    time: string[]
    temperature2mMax: number[]
    temperature2mMin: number[]
    weatherCode: number[]
  }
}
```

## Weather Codes

Open-Meteo provides WMO weather codes (0-99):
- 0: Clear sky
- 1-3: Mainly clear, partly cloudy, overcast
- 45-48: Fog
- 51-67: Drizzle and rain
- 71-77: Snow
- 80-99: Rain showers, thunderstorms

See full mapping in `weatherService.ts`.

## Future Enhancements

**Tracked in separate issues:**
- [ ] Geolocation API support (browser location)
- [ ] C°/F° unit toggle with localStorage persistence
- [ ] Backend proxy endpoint with caching/rate limiting
- [ ] Additional weather data (humidity, wind speed, UV index)
- [ ] Feels-like temperature
- [ ] Hourly forecast view

## Development

```bash
# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage
```

## Migration Notes

**TODO (Week 3+):** Migrate to backend proxy for:
- Request caching (reduce API calls)
- Rate limiting (per user/IP)
- Analytics (track popular locations)
- Error handling and retry logic

See Issue #9 for backend proxy implementation.

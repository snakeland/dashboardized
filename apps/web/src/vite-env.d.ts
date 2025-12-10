/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BASE_URL: string
  readonly VITE_WEATHER_API_BASE?: string
  readonly VITE_GEOCODING_API_BASE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

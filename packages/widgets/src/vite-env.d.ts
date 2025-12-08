/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WEATHER_API_BASE?: string
  readonly VITE_GEOCODING_API_BASE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
  readonly VITE_FIREBASE_MEASUREMENT_ID?: string // Optional: for Analytics
  // Note: No Google Maps API key needed - using free Leaflet + OpenStreetMap
  // Note: No Storage bucket needed - using Base64 in Firestore
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
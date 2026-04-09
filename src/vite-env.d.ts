/// <reference types="vite/client" />

// Optional: Add your custom environment variables here for full IntelliSense
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // Add more variables you plan to use (must start with VITE_)
  // readonly VITE_APP_NAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
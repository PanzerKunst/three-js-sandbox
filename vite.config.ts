import eslint from "@rollup/plugin-eslint"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    eslint({
      include: ["src/**/*.tsx", "src/**/*.ts"],
      throwOnError: true
    }),
    react()
  ],
  build: {
    manifest: true,
    sourcemap: true
  }
})

import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { defineConfig } from "vite";
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig(() => ({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tanstackRouter(),
  ],
  server: {
    port: 5123,
  },
  resolve: {
    tsconfigPaths: true,
  }
}));

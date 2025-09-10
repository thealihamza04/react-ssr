import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  ssr: {
    // Bundle these so the SSR output doesn't require them at runtime
    noExternal: ["react", "react-dom", "react-router", "react-router-dom"]
  }
});

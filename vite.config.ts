import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  // Allow parsing of legacy .js files that contain JSX (from CRA)
  esbuild: {
    // Ensure esbuild parses TSX/JSX files during import analysis
    loader: "tsx",
    include: /src\/.*\.(ts|tsx|js|jsx)$/,
    jsx: "automatic",
  },
  resolve: {
    // Prefer TypeScript extensions first so .tsx/.ts are resolved before .js/.jsx
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },
});

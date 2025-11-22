import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import TanStackRouterVite from "@tanstack/router-plugin/vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import svgr from "vite-plugin-svgr";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/tma-web3-wallet/",
  plugins: [
    TanStackRouterVite(),
    react(),
    svgr(),
    nodePolyfills({
      include: ["buffer", "process", "util", "stream", "events"],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@types": path.resolve(__dirname, "./src/types"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/styles/variables.scss" as *;
          @use "@/styles/mixins.scss" as *;
        `,
      },
    },
  },
  define: {
    global: "globalThis",
  },
  optimizeDeps: {
    include: ["@ton/ton", "@ton/core", "@ton/crypto"],
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },

  build: {
    target: "es2020",
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom"],
          "vendor-router": ["@tanstack/react-router"],
          "vendor-ton": ["@ton/ton", "@ton/core", "@ton/crypto"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    sourcemap: mode !== "production",
  },

  server: {
    allowedHosts: true,
  },
}));

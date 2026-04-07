import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  // Vercel 使用根路径部署
  base: "/",

  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },

  // 【重要提示】
  // server 中的 proxy 仅在本地开发（npm run dev）时有效。
  // 一旦部署到 GitHub Pages（静态环境），这里的代理设置就会失效！
  server: {
    proxy: {
      "/api": {
        target: "http://159.75.169.224:1235",
        changeOrigin: true,
      },
    },
  },
});

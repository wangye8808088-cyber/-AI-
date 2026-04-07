import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // __dirname 是当前文件所在目录的绝对路径（根目录）
      // src 是项目根目录下的 src 目录
      // resolve(__dirname, "src") 是将 __dirname 与 src 目录拼接起来，得到项目根目录下的 src 目录的绝对路径
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      '/api' : {
        target: 'http://159.75.169.224:1235',
        changeOrigin: true,

      }
    }
  }
});

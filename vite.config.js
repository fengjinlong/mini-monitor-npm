import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: true,
    lib: {
      entry: "./src/index",
      name: "minimonitornpm",
      fileName: "minimonitornpm",
      // 导出模块格式
      formats: ["esm"],
    },
  },
});

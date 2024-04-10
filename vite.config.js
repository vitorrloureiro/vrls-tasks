import { defineConfig } from "vite";
import { resolve } from "node:path";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    minify: false,
    target: "ES2022",
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      name: "vrls-tasks",
      fileName: "vrls-tasks",
    },
  },
  test: {
    coverage: {
      include: ["src/tasks/**/*.{js,ts,jsx,tsx}"],
    },
  },
  plugins: [dts({ exclude: "**/*.test.*" })],
});

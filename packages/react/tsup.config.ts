import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "controls/index": "src/controls/index.ts",
    "theme/index": "src/theme/index.ts",
    "cluster/index": "src/cluster/index.ts",
    "route/index": "src/route/index.ts",
    "geo/index": "src/geo/index.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  external: ["react"],
  minify: true,
});

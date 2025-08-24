import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import standard from "eslint-plugin-standard";
import { defineConfig } from "eslint/config";

export default defineConfig([
  standard,
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
]);

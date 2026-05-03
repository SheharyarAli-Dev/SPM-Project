import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // This codebase intentionally fetches data in effects and stores it in state.
      // The rule is too aggressive for typical dashboard pages.
      "react-hooks/set-state-in-effect": "off",
      "@next/next/no-page-custom-font": "off",
    },
  },
]);

export default eslintConfig;

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "plugin:jsx-a11y/recommended"),
  {
    ignores: [
      ".next/*",
      ".next-verify/*",
      ".next-admin/*",
      ".next-seo/*",
      ".test-content/*",
      "test-results/*",
      "node_modules/*",
      ".local-submissions/*",
      "dist/*",
      "build/*",
    ],
  },
];

export default eslintConfig;

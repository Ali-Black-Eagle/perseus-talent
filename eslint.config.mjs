import nextVitals from "eslint-config-next/core-web-vitals";
import jsxA11y from "eslint-plugin-jsx-a11y";

const eslintConfig = [
  ...nextVitals,
  // eslint-config-next already registers the jsx-a11y plugin, so only add the recommended rules.
  { rules: jsxA11y.flatConfigs.recommended.rules },
  // New in eslint-config-next 16 (React Compiler rules). The flagged effects deliberately read the URL
  // after hydration or sync state on back/forward navigation; keep the Next 15 behaviour for now.
  { rules: { "react-hooks/set-state-in-effect": "off" } },
  {
    ignores: [
      ".next/*",
      ".next-verify/*",
      ".next-seo/*",
      "test-results/*",
      "node_modules/*",
      ".local-submissions/*",
      "dist/*",
      "build/*",
    ],
  },
];

export default eslintConfig;

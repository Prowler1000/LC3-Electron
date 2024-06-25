// eslint.config.js
import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";

export default [
  js.configs.recommended,
  {
    rules: {
      "no-unused-vars": "warn",
      "no-unreachable": "warn",
      "no-unreachable-loop": "warn",
      "curly": "consistent",
      "eqeqeq": "smart",
    },
  },
  stylistic.configs.customize({
    
  })
];

import jsonc from "eslint-plugin-jsonc";
import putout from "eslint-plugin-putout";
import pipedream from "@pipedream/eslint-plugin-pipedream";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import importPlugin from "eslint-plugin-import";
import jest from "eslint-plugin-jest";
import globals from "globals";
import parser from "jsonc-eslint-parser";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      "**/scripts",
      "components/**/test-event.mjs",
      "**/.github",
      "**/node_modules",
      "**/package-lock.json",
      "**/pnpm-lock.yaml",
      "**/dist/**",
      "**/*.md",
      "**/*.mdx",
      "**/*.txt",
      "**/*.yml",
      "**/*.yaml",
      "**/*.lock",
      "**/*.py",
      "**/*.png",
      "**/.next",
    ],
  },
  ...compat.extends(
    "eslint:recommended",
    "plugin:jsonc/recommended-with-jsonc",
    "plugin:jest/recommended",
  ),
  {
    plugins: {
      jsonc,
      putout,
      pipedream,
      "@typescript-eslint": typescriptEslint,
      jest,
      "import": importPlugin,
    },

    languageOptions: {
      globals: {
        ...globals.commonjs,
        ...globals.node,
        ...globals.browser,
      },
      ecmaVersion: 12,
      sourceType: "module",
    },

    rules: {
      "arrow-parens": "error",
      "arrow-spacing": "error",

      "array-bracket-newline": [
        "error",
        {
          minItems: 1,
        },
      ],

      "array-element-newline": [
        "error",
        "always",
      ],
      "comma-dangle": [
        "error",
        "always-multiline",
      ],
      "comma-spacing": "error",
      "eol-last": "error",
      "function-call-argument-newline": [
        "error",
        "consistent",
      ],
      "function-paren-newline": [
        "error",
        "consistent",
      ],
      "indent": [
        "error",
        2,
      ],
      "key-spacing": "error",
      "keyword-spacing": "error",

      "max-len": [
        "error",
        {
          code: 100,
          tabWidth: 2,
          ignoreTrailingComments: true,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
        },
      ],

      "multiline-ternary": [
        "error",
        "always",
      ],
      "newline-per-chained-call": "error",

      "no-constant-condition": [
        "error",
        {
          checkLoops: false,
        },
      ],

      "no-multiple-empty-lines": [
        "error",
        {
          max: 1,
          maxBOF: 0,
          maxEOF: 1,
        },
      ],

      "no-trailing-spaces": "error",
      "no-unused-vars": "error",

      "object-curly-newline": [
        "error",
        {
          ExportDeclaration: "always",

          ImportDeclaration: {
            minProperties: 2,
            multiline: true,
          },

          ObjectExpression: {
            minProperties: 1,
            multiline: true,
          },

          ObjectPattern: {
            minProperties: 2,
            multiline: true,
          },
        },
      ],

      "object-curly-spacing": [
        "error",
        "always",
      ],

      "object-property-newline": [
        "error",
        {
          allowAllPropertiesOnSameLine: false,
        },
      ],

      "quote-props": [
        "error",
        "consistent",
      ],
      "quotes": "error",
      "semi": "error",
      "space-before-blocks": [
        "error",
        "always",
      ],
      "space-infix-ops": "error",
    },
  },
  {
    files: [
      "**/.eslintrc",
      "**/*.json",
    ],

    languageOptions: {
      parser: parser,
    },
  },
  {
    files: [
      "**/actions/**/*.*js",
      "**/sources/**/*.*js",
    ],

    rules: {
      "pipedream/required-properties-key": "error",
      "pipedream/required-properties-name": "error",
      "pipedream/required-properties-version": "error",
      "pipedream/required-properties-description": "error",
      "pipedream/required-properties-type": "error",
      "pipedream/props-label": "warn",
      "pipedream/props-description": "warn",
      "pipedream/source-name": "warn",
      "pipedream/source-description": "warn",
      "pipedream/no-ts-version": "warn",
      "pipedream/action-annotations": "error",
    },
  },
  {
    files: [
      "**/actions/**/common*.*js",
      "**/actions/common/*",
      "**/sources/common/*",
      "**/sources/**/common*.*js",
      "**/sources/**/constant*.*js",
      "**/actions/**/constant*.*js",
    ],

    rules: {
      "pipedream/required-properties-key": "off",
      "pipedream/required-properties-name": "off",
      "pipedream/required-properties-version": "off",
      "pipedream/required-properties-description": "off",
      "pipedream/required-properties-type": "off",
      "pipedream/source-name": "off",
      "pipedream/source-description": "off",
      "pipedream/action-annotations": "off",
    },
  },
  {
    files: [
      "**/*.app.*js",
    ],

    rules: {
      "pipedream/props-label": "warn",
      "pipedream/props-description": "warn",
    },
  },
  {
    files: [
      "**/components/bash/**/*.*js",
      "**/components/go/**/*.*js",
      "**/components/node/**/*.*js",
      "**/components/python/**/*.*js",
    ],

    rules: {
      "no-unused-vars": "off",
    },
  },
  ...compat.extends("plugin:@typescript-eslint/recommended").map((config) => ({
    ...config,
    files: [
      "**/*.ts",
      "**/*.tsx",
      "**/*.mts",
    ],
  })),
  {
    files: [
      "**/*.ts",
      "**/*.tsx",
      "**/*.mts",
    ],

    languageOptions: {
      parser: tsParser,
    },

    rules: {
      "no-undef": "error", // XXX maybe lift this higher (not just ts)
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
        },
      ],
      "max-len": "off",
      "semi": "off",
    },
  },
  ...compat.extends("plugin:react/recommended").map((config) => ({
    ...config,
    files: [
      "**/*.tsx",
    ],
    languageOptions: {
      globals: {
        HTMLFormElement: "readonly",
        HTMLInputElement: "readonly",
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  })),
  {
    files: [
      "**/*.tsx",
    ],

    rules: {
      "react/react-in-jsx-scope": "off",
    },
  },
  {
    files: [
      "packages/sdk/src/browser/**/*.ts",
      "packages/sdk/src/shared/**/*.ts",
    ],

    rules: {
      "import/extensions": [
        "error",
        "always",
      ],
    },
  },
  {
    files: [
      "docs-v2/**/*.{js,jsx,ts,tsx}",
    ],
    plugins: {
      "@next": nextPlugin,
      "react": reactPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2020,
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
        React: true,
        JSX: true,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];

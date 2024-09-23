import globals from "globals";
import js from "@eslint/js";
import stylisticJs from "@stylistic/eslint-plugin-js";


export default [
	js.configs.recommended,
	{
		files: ["**/*.js"], 
		languageOptions: {
			sourceType: "commonjs",
			globals: {
				...globals.node,
				...globals.browser,
			},
			ecmaVersion: "latest",
		},
		plugins: {
			"@stylistic/js": stylisticJs,
		},
		rules: {
			"@stylistic/js/indent": [
				"error",
				4
			],
			"@stylistic/js/linebreak-style": [
				"error",
				"unix"
			],
			"@stylistic/js/quotes": [
				"error",
				"double"
			],
			"@stylistic/js/semi": [
				"error",
				"always"
			],
      "eqeqeq": "error",
      "no-trailing-spaces": "error",
      "object-curly-spacing": [
        "error",
        "always"
      ],
      "arrow-spacing": [
        "error",
        {
          "before": true,
          "after": true
        }
      ],
      "no-console": "off",
      "no-unused-vars": [
        "error",
        { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }
      ],
		},
	},
  {
    ignores: ["dist/**"],
  },
];
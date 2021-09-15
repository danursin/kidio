module.exports = {
    parser: "@typescript-eslint/parser",
    extends: ["next", "react-app", "eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
    rules: {
        "sort-imports": "error"
    },
    settings: {
        react: {
            version: "detect"
        }
    }
};

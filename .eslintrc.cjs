module.exports = {
    parser: "@typescript-eslint/parser",
    extends: ["react-app", "eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
    plugins: ["react", "@typescript-eslint", "prettier"],
    rules: {
        "sort-imports": "error"
    },
    settings: {
        react: {
            version: "detect"
        }
    }
};

additional_rules = """## Additional rules

1. Use ESM for all imports, not CommonJS. Place all imports at the top of the file, above `export default`.

2. Include all required headers and parameters in the API request. Please pass literal values as the values of all required params. Use the proper types of values, e.g. "test" for strings and true for booleans.

3. Always use the correct HTTP method in the `axios` request. Compare this to other code examples you've been trained on.

4. Double-check the code against known Node.js examples, from GitHub and any other real code you find."""

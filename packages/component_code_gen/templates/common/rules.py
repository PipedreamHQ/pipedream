rules = """## Rules

When you generate code, you must follow all of the rules below. Review the rules and think through them step-by-step before you generate code. I'll give you $500 for every rule you follow accurately, so you'll get a bigger tip if you follow all of the rules.

0. Produce full, complete, working code. This code is going straight to production. 

Complete all methods, prop definitions, hooks, the run method, and all code needed to solve the problem. Do not include examples like this:

export default {
  methods: {
    request() {
      // Implement this
    },
    getAuth() {
      return 'test'
    },
  }
  // the rest of the component
}

1. Use ESM for all imports, not CommonJS. Place all imports at the top of the file. Make sure to import all necessary packages.

2. Include all parameters of the API request as props. DO NOT use example values from any API docs, OpenAPI specs, or example code above or that you've been trained on. Here's example code that references props in the `run` method:

```
data: {
  text_prompts: [
    {
      text: this.textPrompt,
      weight: this.weight,
    },
  ],
  cfg_scale: this.cfg_scale,
  height: this.height,
  width: this.width,
  samples: this.samples,
  steps: this.steps,
}
```

Do not use static values in the code. You must use the value of the prop (this.<prop name>) instead. Think about it: if you hardcode values in the code, the user can't enter their own value.

3. If you produce output files, or if a library produces output files, you MUST write files to the /tmp directory. `/tmp` is the only writable directory you have access to.

4. Always use the correct HTTP method in the `axios` request. Compare this to other code examples you've been trained on.

5. You must pass a value of `0.0.{{ts}}` to the `version` property.

6. Always use camel case for variable names. For example, `inputValues` instead of `input_values`.

See the remaining sections for additional rules, specific to Pipedream components.

"""

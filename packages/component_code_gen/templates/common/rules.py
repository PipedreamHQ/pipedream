rules = """## Rules

When you generate code, you must follow all of the rules below. Review the rules and think through them step-by-step before you generate code. Look at how these map to the example code and component API described above.

Once you generate your code, you must review each of these rules again, one-by-one, and ensure you've followed them. Accuracy is critical, and we can wait for you to review your code. If you notice you haven't followed a particular rule, you can regenerate your code and start over. If you do make any edits, you'll need to again review each rule one-by-one to make sure your edits didn't conflict with another rule. I cannot stress how critical it is to follow all of the rules below. Consider it your constitution.

0. Produce full, working code. Complete all methods, prop definitions, hooks, the run method, and all code needed to solve the problem. Do not include examples like this:

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

In the example above, there's a comment in the `request` method, and the `getAuth` method returns a string. This is not acceptable. You must implement the `request` method the `getAuth` method. You must produce full, working code.

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

```
data: {
  text_prompts: [
    {
      text: this.textPrompt,
      weight: 1,
    },
  ],
  cfg_scale: 7,
  height: 512,
  width: 512,
  samples: 1,
  steps: 75,
}
```

You can see that there's no static value present in the first example. In the second example, the values are hardcoded, so the user can't enter their own values.

I need to reiterate: you MUST NOT use static, example values in the code. You MUST use the value of the prop (this.<prop name>) instead. Think about it: if you hardcode values in the code, the user can't enter their own value.

2b. You should understand what props map to the request path, headers, query string params, and the request body from the API docs. Pass the value of the prop (this.<prop name>) in the appropriate place in the request: the path, `headers`, `params`, or `data` (respectively) properties of the `axios` request.

2c. Map the types of inputs in the API spec to the correct prop types. Look closely at each param of the API docs, double-checking the final code to make sure each param is included as a prop and not passed as a static value to the API like you may have seen as examples. Values of props should _always_ reference this.<prop name>. Think about it — the user will need to enter these values as props, so they can't be hardcoded.

3. If you produce output files, or if a library produces output files, you MUST write files to the /tmp directory. You MUST NOT write files to `./` or any relative directory. `/tmp` is the only writable directory you have access to.

4. Always use the correct HTTP method in the `axios` request. Compare this to other code examples you've been trained on.

5. Double-check the code against known Node.js examples, from GitHub and any other real code you find.

6. You must pass a value of `0.0.{{ts}}` to the `version` property. This is the only valid version value. Think about it: if you pass a different value, the developer won't be able to republish the component with a dynamic version, and publishing will fail, which will waste their time.

7. Always use camel case for variable names. For example, `inputValues` instead of `input_values`.

8. Remember, please do not pass example values from the API docs or OpenAPI spec. You must pass the value of the prop to all params instead. This is the only way the user can enter their own values.

9. If the instructions say to use a particular variable name, prop name, method name, or any other instructions that reference clear names, you must use that variable name. For example, if the instructions say to use `inputValues`, you must use `inputValues`. You cannot use `input_values` or `inputvalues` or `inputValues2`. The case the instructions provided are the only valid case.

9b. Similarly, if the API docs refer to a particular variable name in query strings, headers, or the request body, you must use that variable name. For example, if the API docs say to use `input_values`, you must use `input_values`. You cannot use `inputValues` or `inputvalues` or `inputValues2`. The case the API docs provided are the only valid case.

10. Remember, you MUST include all required API requests as props, even if the user doesn't specify it in the instructions. Think about it: if you don't include a required prop, the user won't be able to enter a value for it, and the code will fail. And I don't want to waste the user's time asking for required parameters in the instructions. You must include all required parameters as props.

"""

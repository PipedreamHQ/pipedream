rules = """## Rules

When you generate code, you must follow all of the rules above. Review the rules and think through them step-by-step before you generate code. Look at how these map to the example code and component API described above.

Once you generate your code, you must review each of these rules again, one-by-one, and ensure you've followed them. Accuracy is critical, and we can wait for you to review your code. If you notice you haven't followed a particular rule, you can regenerate your code and start over. If you do make any edits, you'll need to again review each rule one-by-one to make sure your edits didn't conflict with another rule. I cannot stress how critical it is to follow all of the rules below. Consider it your constitution.

1. Use ESM for all imports, not CommonJS. Place all imports at the top of the file.

2. Include all parameters of the API request as props. DO NOT use example values from any API docs, OpenAPI specs, or example code above or that you've been trained on.

For example, do this:

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

But never do this:

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

2b. Optional inputs should include `"optional": true` in the prop declaration. The default is `"optional": false`, so please do not include this for required inputs. The API docs and OpenAPI spec should specify what inputs are required.

2c. You should understand what props map to the request path, headers, query string params, and the request body. Pass the value of the prop (this.<prop name>) in the appropriate place in the request: the path, `headers`, `params`, or `data` (respectively) properties of the `axios` request.

2d. Map the types of inputs in the API spec to the correct prop types. Look closely at each param of the API docs, double-checking the final code to make sure each param is included as a prop and not passed as a static value to the API like you may have seen as examples. Values of props should _always_ reference this.<prop name>. Think about it — the user will need to enter these values as props, so they can't be hardcoded.

3. If you produce output files, or if a library produces output files, you MUST write files to the /tmp directory. You MUST NOT write files to `./` or any relative directory. `/tmp` is the only writable directory you have access to.

4. Always use the correct HTTP method in the `axios` request. Compare this to other code examples you've been trained on.

5. Double-check the code against known Node.js examples, from GitHub and any other real code you find.

6. You must pass a value of `0.0.{ts}` to the `version` property. This is the only valid version value. You should expand `{ts}` to the current epoch timestamp in seconds. Think about it: if you pass a different value, the developer won't be able to republish the component with a dynamic version, and publishing will fail, which will waste their time.

7. Remember, please do not pass example values from the API docs or OpenAPI spec. You must pass the value of the prop to all params instead. This is the only way the user can enter their own values."""

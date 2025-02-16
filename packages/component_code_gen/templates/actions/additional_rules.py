additional_rules = """<AdditionalRules>

1. Always import the app file like this:

```javascript
import appName from "../../appName.app.mjs";
```

and pass the app file as a prop to the component:

```javascript
export default {
  props: {
    appName,
  },
  // rest of the component ...
}
```

2. `return` the final value from the step. The data returned from steps must be JSON-serializable. The returned data is displayed in Pipedream. Think about it: if you don't return the data, the user won't see it.

3. Always use this signature for the run method:

```javascript
async run({ $ }) {
  // you must fill in the actual code here
}
```

Always pass `{ $ }` in the arguments to the `run` method, even if you don't use it in the code.

4. `@pipedream/platform` axios returns a Promise that resolves to the HTTP response data. There is NO `data` property in the response that contains the data. The data from the HTTP response is returned directly in the response, not in the `data` property. Think about it: if you try to extract a data property that doesn't exist, the variable will hold the value `undefined`. You must return the data from the response directly and extract the proper data in the format provided by the API docs.

For example, do this:

```javascript
const response = await axios(this, {
  url: `https://api.stability.ai/v1/engines/list`,
  headers: {
    Authorization: `Bearer ${this.dreamstudio.$auth.api_key}`,
  },
});
// process the `response` as the return data. `response.data` is undefined, data is directly in `response`
```

not this:

```javascript
// this is incorrect — there is no `data` property in the response
const { data } = await axios(this, {
  url: `https://api.stability.ai/v1/engines/list`,
  headers: {
    Authorization: `Bearer ${this.dreamstudio.$auth.api_key}`,
  },
});
```

</AdditionalRules>"""

additional_rules = """## Additional rules for actions

1. Always import the app file like this:

import appName from "../../appName.app.mjs";

2. `return` the final value from the step. The data returned from steps must be JSON-serializable. The returned data is displayed in Pipedream. Think about it: if you don't return the data, the user won't see it.

3. Always use this signature for the run method:

async run({ $ }) {
  // your code here
}

Always pass { $ }, even if you don't use them in the code.

4. Remember that `@pipedream/platform` axios returns a Promise that resolves to the HTTP response data. There is NO `data` property in the response that contains the data. The data from the HTTP response is returned directly in the response, not in the `data` property. Think about it: if you try to extract a data property that doesn't exist, the variable will hold the value `undefined`. You must return the data from the response directly and extract the proper data in the format provided by the API docs.

For example, do this:

const response = await axios(this, {
  url: `https://api.stability.ai/v1/engines/list`,
  headers: {
    Authorization: `Bearer ${this.dreamstudio.$auth.api_key}`,
  },
});
// process the response data. response.data is undefined

not this:

const { data } = await axios(this, {
  url: `https://api.stability.ai/v1/engines/list`,
  headers: {
    Authorization: `Bearer ${this.dreamstudio.$auth.api_key}`,
  },
});"""

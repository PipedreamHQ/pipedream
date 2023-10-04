platform_axios = """## Pipedream Platform Axios

If you need to make an HTTP request use the `axios` constructor from the `@pipedream/platform` package, and include the following import at the top of your Node.js code, above the component, in this exact format:

import { axios } from "@pipedream/platform";

You MUST use that import format when importing axios. Do NOT attempt to import any other package like `import axios from "@pipedream/platform/axios"`.

The `axios` constructor takes two arguments:

1. `$ = this` - the context passed by the run method of the component.

2. `config` - the same as the `config` object passed to the `axios` constructor in the standard `axios` package, with some extra properties.

For example:

```
import { axios } from "@pipedream/platform";

// Note that we do not export a data property and return the response directly — see below
const models = await axios($, {
  url: `https://api.openai.com/v1/models`,
  headers: {
    Authorization: `Bearer ${this.openai.$auth.api_key}`,
  },
})

### Data is returned directly from the axios response, NOT in a `data` property

Ignore everything you know about responses from the `axios` package. `@pipedream/platform` axios is written in a different way. We'll describe that API below.

`@pipedream/platform` axios returns a Promise that resolves to the HTTP response data. There is NO `data` property in the response that contains the data. The data from the HTTP response is returned directly in the response, not in the `data` property.

For example, assume you have the following methods defined:

```
_baseUrl() {
  return "https://app.saleslens.io/api";
},
async _makeRequest(opts = {}) {
  const {
    $ = this,
    method = "GET",
    path,
    headers,
    ...otherOpts
  } = opts;
  return axios($, {
    ...otherOpts,
    method,
    url: this._baseUrl() + path,
    headers: {
      ...headers,
      Authorization: this.$auth.api_token,
    },
  });
},
async getEmployees() {
  return this._makeRequest({
    path: "/access_token/employees",
  });
},
```

You should call the getEmployees like this:

```
const employees = await this.getEmployees();
```

Do not do this:

```
const { data } = await this.getEmployees();
```

and not this:

```
const { items } = await this.getEmployees();
```

Do not destructure any properties from the response. The response is returned directly, not in a `data`, `items`, or any other property.

This is critical to get right, and the code will fail if you get it wrong. Think about it: the `axios` constructor returns the data directly, not in a `data` property. Therefore, you should not destructure `data` from the response when calling `axios`. Otherwise the `data` variable will be undefined.

"""

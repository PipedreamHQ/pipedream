additional_rules = """## Additional rules

### axios responses

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
async getCategories() {
  return this._makeRequest({
    path: "/access_token/categories",
  });
},
```

You should call the getEmployees and getCategories like this:

```
const employees = await this.getEmployees();
const categories = await this.getCategories();
```

NOT this:

```
// data is undefined here
const { data } = await this.getEmployees();
const { data } = await this.getCategories();

// items is undefined here
const { items } = await this.getEmployees();
const { data } = await this.getCategories();

// etc.
```

Do not destructure any properties from the response. The response is returned directly, not in a `data`, `items`, or any other property.

This is critical to get right, and the code will fail if you get it wrong. Think about it: the `axios` constructor returns the data directly, not in a `data` property. Therefore, you should not destructure `data` from the response when calling `axios`. Otherwise the `data` variable will be undefined.

### Generate propDefinitions and methods for ALL requirements

The instructions should note the actions and source components that are required for the app. The code generator should generate the propDefinitions and methods for ALL requirements. Think about it: this way other agents will be able to use the shared props + methods in the action and source components. Double-check your output to make sure that the propDefinitions and methods are generated for ALL requirements.
"""

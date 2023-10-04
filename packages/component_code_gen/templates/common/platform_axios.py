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

### axios responses

Ignore everything you know about responses from `axios` requests. `@pipedream/platform` axios is different than `axios`.

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

Here's another example of some prop definitions that use these methods. Do this:

```
export default {
  type: "app",
  app: "saleslens",
  propDefinitions: {
    employeeExternalId: {
      type: "string",
      label: "Employee External ID",
      description: "The external ID of the employee",
      async options() {
        const employees = await this.getEmployees();
        return employees.map((e) => ({
          value: e.externalId,
          label: `${e.firstName} ${e.lastName}`,
        }));
      },
    },
    categoryId: {
      type: "string",
      label: "Category ID",
      description: "The ID of the category",
      async options() {
        const categories = await this.getCategories();
        return categories.map((e) => ({
          value: e.id,
          label: e.title,
        }));
      },
    },
    ...
  },
};
```

NOT this:

```
export default {
  type: "app",
  app: "saleslens",
  propDefinitions: {
    employeeExternalId: {
      type: "string",
      label: "Employee External ID",
      description: "The external ID of the employee",
      async options() {
        const { items } = await this.getEmployees();
        return items.map((e) => ({
          value: e.externalId,
          label: `${e.firstName} ${e.lastName}`,
        }));
      },
    },
    categoryId: {
      type: "string",
      label: "Category ID",
      description: "The ID of the category",
      async options() {
        const { items } = await this.getCategories();
        return items.map((e) => ({
          value: e.id,
          label: e.title,
        }));
      },
    },
    ...
  },
};
```

Do not destructure any properties from the response. The response is returned directly, not in a `data`, `items`, or any other property.

This is critical to get right, and the code will fail if you get it wrong. Think about it: the `axios` constructor returns the data directly, not in a `data` property. Therefore, you should not destructure `data` from the response when calling `axios`. Otherwise the `data` variable will be undefined.

"""

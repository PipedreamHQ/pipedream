platform_axios = """## Pipedream Platform Axios

If you need to make an HTTP request use the `axios` constructor from the `@pipedream/platform` package, and include the following import at the top of your Node.js code, above the component, in this exact format:

import { axios } from "@pipedream/platform";

You MUST use that import format when importing axios. Do NOT attempt to import any other package like `import axios from "@pipedream/platform/axios"`.

The `axios` constructor takes two arguments:

1. `this` - the context passed by the run method of the component.

2. `config` - the same as the `config` object passed to the `axios` constructor in the standard `axios` package, with some extra properties.

For example:

return await axios($, {
  url: `https://api.openai.com/v1/models`,
  headers: {
    Authorization: `Bearer ${this.openai.$auth.api_key}`,
  },
})

`@pipedream/platform` axios returns a Promise that resolves to the HTTP response data. There is NO `data` property in the response that contains the data. The data from the HTTP response is returned directly in the response, not in the `data` property."""

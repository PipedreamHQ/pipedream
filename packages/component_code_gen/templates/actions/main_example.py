main_example = """<Example>
<OpenAI>

Here's an example Pipedream action for OpenAI that lists all models available to the user:

```javascript
import openai from "../../openai.app.mjs"
import { axios } from "@pipedream/platform"

export default {
  key: "openai-list-models",
  name: "List Models",
  description: "Lists all models available to the user. [See the documentation](${docsLink})",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    openai,
  },
  async run({ $ }) {
    const response = await axios($, {
      url: `https://api.openai.com/v1/models`,
      headers: {
        Authorization: `Bearer ${this.openai.$auth.api_key}`,
      },
    })
    $.export("$summary", "Successfully listed models")
    return response
  },
};
```
</OpenAI>
</Example>
"""

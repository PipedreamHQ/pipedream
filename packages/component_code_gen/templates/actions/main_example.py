main_example = """## OpenAI example component

Here's an example component:

```
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
```"""

main_example = """Here's an example component:

```javascript
import { axios } from "@pipedream/platform"
export default defineComponent({
  key: "openai-list-models",
  name: "List Models",
  description: "Lists all models available to the user.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    openai: {
      type: "app",
      app: "openai",
    }
  },
  async run({steps, $}) {
    const response = await axios($, {
      url: `https://api.openai.com/v1/models`,
      headers: {
        Authorization: `Bearer ${this.openai.$auth.api_key}`,
      },
    })
    $.export("$summary", "Successfully listed models")
    return response
  },
})
```"""

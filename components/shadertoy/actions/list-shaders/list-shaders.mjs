import shadertoy from "../../shadertoy.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "shadertoy-list-shaders",
  name: "List Shaders",
  description: "Returns an array of shader IDs based on the query string. [See the documentation](https://www.shadertoy.com/howto)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    shadertoy,
    query: {
      propDefinition: [
        shadertoy,
        "query",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.shadertoy.queryShaders({
      query: this.query,
    });
    const shaderIds = response.map((shader) => shader.id);
    $.export("$summary", `Found ${shaderIds.length} shaders matching the query "${this.query}"`);
    return shaderIds;
  },
};

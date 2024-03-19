import shadertoy from "../../shadertoy.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "shadertoy-get-shader",
  name: "Get Shader",
  description: "Returns a specific shader based on an ID. [See the documentation](https://www.shadertoy.com/howto)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    shadertoy,
    shaderId: {
      propDefinition: [
        shadertoy,
        "shaderId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.shadertoy.getShaderById({
      shaderId: this.shaderId,
    });
    $.export("$summary", `Successfully retrieved shader with ID: ${this.shaderId}`);
    return response;
  },
};

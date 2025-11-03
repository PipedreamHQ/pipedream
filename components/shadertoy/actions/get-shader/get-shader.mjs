import app from "../../shadertoy.app.mjs";

export default {
  key: "shadertoy-get-shader",
  name: "Get Shader",
  description: "Returns a specific shader based on an ID. [See the documentation](https://www.shadertoy.com/howto)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    shaderId: {
      propDefinition: [
        app,
        "shaderId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getShaderById({
      $,
      shaderId: this.shaderId,
    });

    $.export("$summary", `Successfully retrieved shader with ID: ${this.shaderId}`);

    return response;
  },
};

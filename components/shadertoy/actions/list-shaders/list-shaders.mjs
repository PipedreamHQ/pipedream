import app from "../../shadertoy.app.mjs";

export default {
  key: "shadertoy-list-shaders",
  name: "List Shaders",
  description: "Returns a list of all shaders. [See the documentation](https://www.shadertoy.com/howto)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.listShaders({
      $,
    });

    $.export("$summary", `Found ${response.Results.length} shaders`);

    return response;
  },
};

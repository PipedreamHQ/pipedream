import app from "../../shadertoy.app.mjs";

export default {
  key: "shadertoy-access-assets",
  name: "Access Shader Assets",
  description: "Accesses an asset from source. [See the documentation](https://www.shadertoy.com/howto)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    assetSource: {
      type: "string",
      label: "Asset Source",
      description: "The source to the specific asset",
    },
  },
  async run({ $ }) {
    const response = await this.app.getShaderAsset({
      $,
      assetSource: this.assetSource,
    });

    $.export("$summary", `Successfully accessed asset "${this.assetSource}"`);

    return response;
  },
};

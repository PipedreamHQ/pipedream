import shadertoy from "../../shadertoy.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "shadertoy-access-assets",
  name: "Access Shader Assets",
  description: "Accesses an asset from a shader. [See the documentation](https://www.shadertoy.com/howto)",
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
    assetPath: {
      type: "string",
      label: "Asset Path",
      description: "The path to the specific asset of the shader",
    },
  },
  async run({ $ }) {
    const shaderAsset = await this.shadertoy.getShaderAsset({
      shaderId: this.shaderId,
      assetPath: this.assetPath,
    });

    $.export("$summary", `Successfully accessed asset from shader with ID ${this.shaderId}`);
    return shaderAsset;
  },
};

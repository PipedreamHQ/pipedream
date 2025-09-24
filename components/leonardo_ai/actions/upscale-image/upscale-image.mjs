import app from "../../leonardo_ai.app.mjs";

export default {
  key: "leonardo_ai-upscale-image",
  name: "Upscale Image",
  description: "Creates a high-resolution upscale of the provided image using Leonardo AI's upscale API. [See the documentation](https://docs.leonardo.ai/reference/createvariationupscale)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    imageId: {
      type: "string",
      label: "Image ID",
      description: "The ID of the image to upscale. This should be a previously generated or uploaded image ID.",
    },
  },
  async run({ $ }) {
    const { imageId } = this;

    const data = {
      id: imageId,
    };

    const response = await this.app._makeRequest({
      $,
      method: "POST",
      path: "/variations/upscale",
      data,
    });

    $.export("$summary", `Successfully upscaled image ID: ${imageId}`);
    return response;
  },
};

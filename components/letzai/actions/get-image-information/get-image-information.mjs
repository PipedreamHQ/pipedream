import letzai from "../../letzai.app.mjs";

export default {
  key: "letzai-get-image-information",
  name: "Get Image Information",
  description: "Retrieves information about a specific image by ID. [See the documentation](https://api.letz.ai/doc#/images/images_get)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    letzai,
    imageId: {
      propDefinition: [
        letzai,
        "imageId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.letzai.retrieveImageInfo({
      $,
      imageId: this.imageId,
    });
    $.export("$summary", `Successfully retrieved information for image ID: ${this.imageId}`);
    return response;
  },
};

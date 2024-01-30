import publisherkit from "../../publisherkit.app.mjs";

export default {
  key: "publisherkit-create-image",
  name: "Create Image",
  description: "Generates a new image within PublisherKit. Required props include image data and image format, while an optional prop is image metadata.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    publisherkit,
    templateId: publisherkit.propDefinitions.templateId,
    imageData: publisherkit.propDefinitions.imageData,
    imageFormat: publisherkit.propDefinitions.imageFormat,
    imageMetadata: {
      ...publisherkit.propDefinitions.imageMetadata,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.publisherkit.createImage({
      templateId: this.templateId,
      imageData: this.imageData,
      imageFormat: this.imageFormat,
      imageMetadata: this.imageMetadata,
    });
    $.export("$summary", `Successfully created image with ID: ${response.id}`);
    return response;
  },
};

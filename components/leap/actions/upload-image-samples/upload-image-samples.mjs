import leap from "../../leap.app.mjs";

export default {
  key: "leap-upload-image-samples",
  name: "Upload Image Samples",
  description: "Uploads image samples to a custom model. [See the documentation](https://docs.tryleap.ai/reference/samplescontroller_createurl)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    leap,
    model: {
      propDefinition: [
        leap,
        "model",
      ],
    },
    images: {
      type: "string[]",
      label: "Image URLs",
      description: "An array of strings containing the URLs of the images to upload",
    },
    returnInObject: {
      type: "boolean",
      label: "Return in Object",
      description: "Whether to return the sample in the response as an object. Will return array if false.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.leap.uploadImageSamples({
      modelId: this.model,
      params: {
        returnInObject: this.returnInObject,
      },
      data: {
        images: this.images,
      },
      $,
    });

    if (response) {
      const length = this.returnInObject
        ? response.data.length
        : response.length;
      $.export("$summary", `Successfully uploaded ${length} image${length === 1
        ? ""
        : "s"}`);
    }

    return response;
  },
};

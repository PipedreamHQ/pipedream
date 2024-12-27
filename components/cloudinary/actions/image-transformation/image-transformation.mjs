import cloudinary from "../../cloudinary.app.mjs";

export default {
  key: "cloudinary-image-transformation",
  name: "Transform Image",
  description: "Transform an image asset on-the-fly with several options. [See the documentation](https://cloudinary.com/documentation/image_transformations)",
  version: "0.1.0",
  type: "action",
  props: {
    cloudinary,
    assetId: {
      propDefinition: [
        cloudinary,
        "assetId",
      ],
    },
    width: {
      type: "integer",
      label: "Width",
      description: "The new width of the image, e.g. `300`",
      optional: true,
    },
    height: {
      type: "integer",
      label: "Height",
      description: "The new height of the image, e.g. `300`",
      optional: true,
    },
    background: {
      type: "string",
      label: "Background",
      description: "The background color to apply on transparent areas of the image, as a named color or RGB(A) value, e.g. `blue` or `8B0`",
      optional: true,
    },
    opacity: {
      type: "integer",
      label: "Opacity",
      description: "The opacity level to set for the image, from 0 to 100",
      optional: true,
      min: 0,
      max: 100,
    },
    transformations: {
      propDefinition: [
        cloudinary,
        "transformations",
      ],
    },
  },
  async run({ $ }) {
    const {
      cloudinary, assetId, transformations, ...options
    } = this;
    try {
      const response = await cloudinary.transformAsset(assetId, {
        ...options,
        ...transformations,
      });

      if (response) {
        $.export("$summary", "Successfully transformed image");
      }

      return response;
    } catch (err) {
      throw new Error(`Cloudinary error response: ${err.error?.message ?? JSON.stringify(err)}`);
    }
  },
};

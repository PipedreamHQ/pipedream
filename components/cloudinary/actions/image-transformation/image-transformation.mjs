import cloudinary from "../../cloudinary.app.mjs";

export default {
  key: "cloudinary-image-transformation",
  name: "Transform Image",
  description: "Transform an image on-the-fly with several options. [See the documentation](https://cloudinary.com/documentation/image_transformations)",
  version: "0.1.{{ts}}",
  type: "action",
  props: {
    cloudinary,
    imageSource: {
      type: "string",
      label: "Public ID",
      description: "The [public ID](https://cloudinary.com/documentation/upload_images#public_id) of the asset , e.g. `folder/filename`.",
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
      type: "object",
      label: "Additional Transformations",
      description: "Additional transformations to apply to the image. [See the documentation](https://cloudinary.com/documentation/transformation_reference#co_color) for all available transformations. Example: `{ \"angle\": 90, \"color_space\": \"srgb\"}`",
    },
  },
  async run({ $ }) {
    const { cloudinary, imageSource, transformations, ...options } = this;
    try {
    const response = await cloudinary.transformImage(imageSource, { 
      ...options,
      ...transformations,
    });

    if (response) {
      $.export("$summary", "Successfully transformed image.");
    }

    return response;
  } catch (err) {
    throw new Error(`Cloudinary error response: ${err.error?.message ?? JSON.stringify(err)}`);
  }
  },
};

import cloudinary from "../../cloudinary.app.mjs";

export default {
  key: "cloudinary-image-transformation",
  name: "Image Transformation",
  description: "Transforms images on-the-fly. It modifies them to any required format, style and dimension, resize and crop the images, etc. [See the documentation](https://cloudinary.com/documentation/image_transformations)",
  version: "0.1.2",
  type: "action",
  props: {
    cloudinary,
    imageSource: {
      type: "string",
      label: "Public ID",
      description: "The [public ID](https://cloudinary.com/documentation/upload_images#public_id) that references a file you've previously uploaded to Cloudinary, e.g. `folder/filename`.",
    },
    options: {
      type: "object",
      label: "Options",
      description: "The image transformation options to apply and/or the URL parameters supported by Cloudinary API. For all transformation options, please check [Image transformation API reference](https://cloudinary.com/documentation/image_transformation_reference), for URL parameters, please check [Transforming media assets using dynamic URLs](https://cloudinary.com/documentation/image_transformations#transforming_media_assets_using_dynamic_urls)",
    },
  },
  async run({ $ }) {
    const response = await this.cloudinary.transformImage(this.imageSource, this.options);

    if (response) {
      $.export("$summary", "Successfully transformed image.");
    }

    return response;
  },
};

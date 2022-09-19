// legacy_hash_id: a_rJip44
import { v2 } from "cloudinary";

export default {
  key: "cloudinary-image-transformation",
  name: "Image Transformation",
  description: "Transforms images on-the-fly. It modifies them to any required format, style and dimension, resize and crop the images, etc.",
  version: "0.1.1",
  type: "action",
  props: {
    cloudinary: {
      type: "app",
      app: "cloudinary",
    },
    image_source: {
      type: "string",
      label: "Public ID",
      description: "The [public ID](https://cloudinary.com/documentation/upload_images#public_id) that references a file you've previously uploaded to Cloudinary, e.g. `folder/filename`.",
    },
    options: {
      type: "object",
      description: "The image transformation options to apply and/or the URL parameters supported by Cloudinary API. For all transformation options, please check [Image transformation API reference](https://cloudinary.com/documentation/image_transformation_reference), for URL parameters, please check [Transforming media assets using dynamic URLs](https://cloudinary.com/documentation/image_transformations#transforming_media_assets_using_dynamic_urls)",
    },
  },
  async run() {
  //See the API docs: https://cloudinary.com/documentation/image_transformations

    if (!this.image_source || !this.options) {
      throw new Error("Must provide image_source and options parameters.");
    }

    //Imports and sets up the Cloudinary SDK
    const cloudinary = v2;
    cloudinary.config({
      cloud_name: this.cloudinary.$auth.cloud_name,
      api_key: this.cloudinary.$auth.api_key,
      api_secret: this.cloudinary.$auth.api_secret,
    });

    //Performs the image transformations indicated by the options parameter
    return await cloudinary.image(this.image_source, this.options);
  },
};

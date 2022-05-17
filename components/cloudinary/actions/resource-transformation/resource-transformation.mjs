// legacy_hash_id: a_Mdizvn
import { v2 } from "cloudinary";

export default {
  key: "cloudinary-resource-transformation",
  name: "Resource Transformation",
  description: "Transforms image or video resources on-the-fly.  It allows transformation options for resource optimization (i.e. web viewing), resize and crop the resources, etc.",
  version: "0.2.1",
  type: "action",
  props: {
    cloudinary: {
      type: "app",
      app: "cloudinary",
    },
    resource_type: {
      type: "string",
      description: "Type of the resource to upload. Valid values: `image`, `video`.",
      options: [
        "image",
        "video",
      ],
    },
    options: {
      type: "string",
      description: "For an image `resource_type`, use this parameter to set the image transformation options to apply and/or the URL parameters supported by Cloudinary API. For all transformation options, please check [Image transformation API reference](https://cloudinary.com/documentation/image_transformation_reference), for URL parameters, please check [Transforming media assets using dynamic URLs](https://cloudinary.com/documentation/image_transformations#transforming_media_assets_using_dynamic_urls).\nFor a video `resource_type`, use this parameter to set video transformation options to apply and/or the URL parameters supported by Cloudinary API. For all transformation options, please check [Video transformation API reference](https://cloudinary.com/documentation/video_transformation_reference), for URL parameters, please check [Transforming media assets using dynamic URLs](https://cloudinary.com/documentation/image_transformations#transforming_media_assets_using_dynamic_urls).",
    },
    image_source: {
      type: "string",
      description: "If `resource_type` is an image, use this parameter to point to the source of the image to apply transformations on. It can be a local file, the actual image data, a remote FTP, HTTP or HTTPS URL address of an existing image. For details and examples, see: [file source options](https://cloudinary.com/documentation/upload_images#file_source_options).",
      optional: true,
    },
    video_public_id: {
      type: "string",
      description: "If `resource_type` is a video, use this parameter to set the public id of the video to apply transformations on. The public id is the unique identifier of the video, and is either specified when uploading the video to your Cloudinary account, or automatically assigned by Cloudinary. For more details on the options for specifying the public id, see [Public ID - the image identifier](https://cloudinary.com/documentation/upload_images#public_id).",
      optional: true,
    },
  },
  async run() {
  //See the API docs, for image transformations: https://cloudinary.com/documentation/image_transformations
  //for video transformations: https://cloudinary.com/documentation/video_transformation_reference

    if (!this.resource_type || !this.options) {
      throw new Error("Must provide resource_type and options parameters.");
    }

    //Imports and sets up the Cloudinary SDK
    const cloudinary = v2;
    cloudinary.config({
      cloud_name: this.cloudinary.$auth.cloud_name,
      api_key: this.cloudinary.$auth.api_key,
      api_secret: this.cloudinary.$auth.api_secret,
    });

    //Performs the resource transformations indicated by the options parameter
    if (this.resource_type == "image") {
      return await cloudinary.image(this.image_source, this.options);
    } else if (this.resource_type == "video") {
      return await cloudinary.video(this.video_public_id, this.options);
    }
  },
};

import cloudinary from "../../cloudinary.app.mjs";

export default {
  key: "cloudinary-resource-transformation",
  name: "Resource Transformation",
  description: "Transforms image or video resources on-the-fly.  It allows transformation options for resource optimization (i.e. web viewing), resize and crop the resources, etc. [Image transformation documentation](https://cloudinary.com/documentation/image_transformations). [Video transformation documentation](https://cloudinary.com/documentation/video_transformation_reference)",
  version: "0.2.2",
  type: "action",
  props: {
    cloudinary,
    resourceType: {
      propDefinition: [
        cloudinary,
        "transformationResourceType",
      ],
    },
    options: {
      type: "string",
      label: "Options",
      description: "For an image `resourceType`, use this parameter to set the image transformation options to apply and/or the URL parameters supported by Cloudinary API. For all transformation options, please check [Image transformation API reference](https://cloudinary.com/documentation/image_transformation_reference), for URL parameters, please check [Transforming media assets using dynamic URLs](https://cloudinary.com/documentation/image_transformations#transforming_media_assets_using_dynamic_urls).\nFor a video `resourceType`, use this parameter to set video transformation options to apply and/or the URL parameters supported by Cloudinary API. For all transformation options, please check [Video transformation API reference](https://cloudinary.com/documentation/video_transformation_reference), for URL parameters, please check [Transforming media assets using dynamic URLs](https://cloudinary.com/documentation/image_transformations#transforming_media_assets_using_dynamic_urls).",
    },
    imageSource: {
      type: "string",
      label: "Image Source",
      description: "If `resourceType` is an image, use this parameter to point to the source of the image to apply transformations on. It can be a local file, the actual image data, a remote FTP, HTTP or HTTPS URL address of an existing image. For details and examples, see: [file source options](https://cloudinary.com/documentation/upload_images#file_source_options).",
      optional: true,
    },
    videoPublicId: {
      type: "string",
      label: "Video Public Id",
      description: "If `resourceType` is a video, use this parameter to set the public id of the video to apply transformations on. The public id is the unique identifier of the video, and is either specified when uploading the video to your Cloudinary account, or automatically assigned by Cloudinary. For more details on the options for specifying the public id, see [Public ID - the image identifier](https://cloudinary.com/documentation/upload_images#public_id).",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = this.resourceType === "image"
      ? await this.cloudinary.transformImage(this.imageSource, this.options)
      : await this.cloudinary.transformVideo(this.videoPublicId, this.options);

    if (response) {
      $.export("$summary", `Successfully transformed ${this.resourceType}`);
    }

    return response;
  },
};

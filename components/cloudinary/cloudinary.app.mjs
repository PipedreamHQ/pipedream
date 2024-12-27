import { v2 } from "cloudinary";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "cloudinary",
  propDefinitions: {
    resourceType: {
      type: "string",
      label: "Resource Type",
      description: "The type of asset. Defaults to `image` if not specified. `Note:` use video for all video and audio assets, such as `.mp3`. ",
      options: constants.RESOURCE_TYPE_OPTIONS,
      default: "image",
      optional: true,
    },
    transformationResourceType: {
      type: "string",
      label: "Resource Type",
      description: "Type of the resource to upload. Valid values: `image`, `video`.",
      options: constants.TRANSFORMATION_RESOURCE_TYPE_OPTIONS,
      default: "image",
      optional: true,
    },
    uploadResourceType: {
      type: "string",
      label: "Resource Type",
      description: "Set the type of file you are uploading or use `auto` to automatically detect the file type. Valid values: `image`, `raw`, `video` and `auto`. Defaults: `image` for server-side uploading and `auto` for client-side uploading.\n**Note**: Use the video resource type for all video assets as well as for audio files, such as `.mp3`.",
      options: constants.UPLOAD_RESOURCE_TYPE_OPTIONS,
      default: "image",
      optional: true,
    },
    deliveryType: {
      type: "string",
      label: "Filter by Type",
      description: "Find assets with the specified delivery type (defaults to `upload`).",
      options: constants.DELIVERY_TYPE_OPTIONS,
      default: "upload",
      optional: true,
    },
    uploadDeliveryType: {
      type: "string",
      label: "Type",
      description: "The delivery type. Allows uploading assets as `private` or `authenticated` instead of the default `upload` mode.",
      options: constants.UPLOAD_DELIVERY_TYPE_OPTIONS,
      default: "upload",
      optional: true,
    },
    accessMode: {
      type: "string",
      label: "Access Mode",
      description: "Allows the asset to behave as if it's of the authenticated 'type'. Default is `public`. The asset can later be made public by changing its Access Mode via the [Admin API](https://cloudinary.com/documentation/admin_api#update_access_mode), without having to update any delivery URLs.",
      optional: true,
      options: constants.ACCESS_MODE_OPTIONS,
    },
  },
  methods: {
    _client() {
      const cloudinary = v2;
      cloudinary.config({
        cloud_name: this.$auth.cloud_name,
        api_key: this.$auth.api_key,
        api_secret: this.$auth.api_secret,
      });
      return cloudinary;
    },
    async getResources(options) {
      return this._client().api.resources(options);
    },
    async getUsage(options) {
      return this._client().api.usage(options);
    },
    async transformImage(imageSource, options) {
      return this._client().url(imageSource, options);
    },
    async transformVideo(videoPublicId, options) {
      return this._client().video(videoPublicId, options);
    },
    async uploadMedia(file, options) {
      return this._client().uploader.upload(file, options);
    },
  },
};

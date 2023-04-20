import { v2 } from "cloudinary";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "cloudinary",
  propDefinitions: {
    resourceType: {
      type: "string",
      label: "Resource Type",
      description: "The type of asset. Defaults to `image` if left blank",
      options: constants.RESOURCE_TYPE_OPTIONS,
      default: "image",
      optional: true,
    },
    deliveryType: {
      type: "string",
      label: "Type",
      description: "The delivery type. Defaults to `upload` if left blank",
      options: constants.DELIVERY_TYPE_OPTIONS,
      default: "upload",
      optional: true,
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
  },
};

import typeform from "../../typeform.app.mjs";
import common from "../common.mjs";

export default {
  key: "typeform-delete-image",
  name: "Delete an Image",
  description: "Deletes and image from your Typeform account. [See the docs here](https://developer.typeform.com/create/reference/delete-image/)",
  type: "action",
  version: "0.0.1",
  methods: common.methods,
  props: {
    typeform,
    imageId: {
      type: "string",
      label: "Image ID",
      description: "Unique ID for the image to be deleted",
    },
  },
  async run({ $ }) {
    const { imageId } = this;

    try {
      const response =
        await this.typeform.deleteImage({
          $,
          imageId,
        });

      if (!response) {
        return {
          id: imageId,
          success: true,
        };
      }

      return response;

    } catch (error) {
      const message =
        error.response?.status === 404
          ? "Image not found. Please enter the ID again."
          : error;
      throw new Error(message);
    }
  },
};

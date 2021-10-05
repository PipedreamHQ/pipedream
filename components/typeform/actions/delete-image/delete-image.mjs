import typeform from "../../typeform.app.mjs";
import common from "../common.mjs";

export default {
  ...common,
  key: "typeform-delete-image",
  name: "Delete an Image",
  description: "Deletes and image from your Typeform account. [See the docs here](https://developer.typeform.com/create/reference/delete-image/)",
  type: "action",
  version: "0.0.1",
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
  },
};

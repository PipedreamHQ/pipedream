import typeform from "../../typeform.app.mjs";
import common from "../common.mjs";

export default {
  ...common,
  key: "typeform-delete-image",
  name: "Delete an Image",
  description: "Delete an image from your Typeform account. [See the docs here](https://developer.typeform.com/create/reference/delete-image/)",
  type: "action",
  version: "0.0.1",
  props: {
    typeform,
    imageId: {
      type: "string",
      label: "Image ID",
      description: "Specify the image ID to be deleted",
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
      },
      $.export("$summary", `🎉 Successfully deleted the image, "${imageId}"`)
    }

    return response;
  },
};

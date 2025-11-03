import typeform from "../../typeform.app.mjs";

export default {
  key: "typeform-delete-image",
  name: "Delete an Image",
  description: "Deletes an image from your Typeform account. [See the docs here](https://developer.typeform.com/create/reference/delete-image/)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    typeform,
    imageId: {
      type: "string",
      label: "Image ID",
      description: "Unique ID for the image to be deleted",
      async options () {
        const images = await this.typeform.getImages();
        return images.map((image) => ({
          label: image.file_name,
          value: image.id,
        }));
      },
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
      $.export("$summary", `Successfully deleted the image, "${imageId}" from your account`);
      return {
        id: imageId,
        success: true,
      };
    }

    return response;
  },
};

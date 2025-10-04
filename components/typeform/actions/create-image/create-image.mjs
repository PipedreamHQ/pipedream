import typeform from "../../typeform.app.mjs";

export default {
  key: "typeform-create-image",
  name: "Create an Image",
  description: "Adds an image in your Typeform account. [See the docs here](https://developer.typeform.com/create/reference/create-image/)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    typeform,
    fileName: {
      type: "string",
      label: "File name",
      description: "File name for the image",
    },
    image: {
      type: "string",
      label: "Base64 image",
      description: "Base64 code for the image. Note that base64 encoders may add descriptors to the code (such as `data:image/png;base64,`). Do not include these descriptors in your image string---include only the base64 code. We also recommend that you don't paste the exact string value into this property box. Instead you can [pass an expression](https://pipedream.com/docs/workflows/steps/params/#entering-expressions) that references a variable from a previous step such as `{{steps.nodejs.$return_value}}`.",
      optional: true,
    },
    url: {
      type: "string",
      label: "Image's URL",
      description: "URL of the image to be added in your Typeform account",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.image && !this.url) {
      throw new Error("This action requires either Base64 image or Image's URL. Please enter one or the other above.");
    }

    const data = {
      file_name: this.fileName,
      image: this.image,
      url: this.url,
    };

    const resp = await this.typeform.createImage({
      $,
      data,
    });

    $.export("$summary", "Successfully added a new image to your account");

    return resp;
  },
};

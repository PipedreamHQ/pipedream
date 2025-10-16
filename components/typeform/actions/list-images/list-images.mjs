import typeform from "../../typeform.app.mjs";

export default {
  key: "typeform-list-images",
  name: "List Images",
  description: "Retrieves a list of JSON descriptions for all images in your Typeform account. [See the docs here](https://developer.typeform.com/create/reference/retrieve-images-collection/)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    typeform,
  },
  async run({ $ }) {
    const resp = await this.typeform.getImages($);

    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully retrieved ${resp.length} ${resp.length == 1 ? "image" : "images"}`);

    return resp;
  },
};

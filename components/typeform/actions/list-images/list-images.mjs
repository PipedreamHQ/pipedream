import typeform from "../../typeform.app.mjs";

export default {
  key: "typeform-list-images",
  name: "List Images",
  description: "Retrieves a list of JSON descriptions for all images in your Typeform account. [See the docs here](https://developer.typeform.com/create/reference/retrieve-images-collection/)",
  type: "action",
  version: "0.0.1",
  props: {
    typeform,
  },
  async run({ $ }) {
    return await this.typeform.getImages($);
  },
};

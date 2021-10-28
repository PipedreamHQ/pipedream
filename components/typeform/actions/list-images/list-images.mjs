import typeform from "../../typeform.app.mjs";
import common from "../common.mjs";

export default {
  key: "typeform-list-images",
  name: "List Images",
  description: "Retrieves a list of JSON descriptions for all images in your Typeform account. [See the docs here](https://developer.typeform.com/create/reference/retrieve-images-collection/)",
  type: "action",
  version: "0.0.1",
  methods: common.methods,
  props: {
    typeform,
  },
  async run({ $ }) {
    try {
      return await this.typeform.getImages($);

    } catch (error) {
      throw new Error(error);
    }
  },
};

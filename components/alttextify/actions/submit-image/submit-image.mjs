import alttextify from "../../alttextify.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "alttextify-submit-image",
  name: "Submit Image to Alttextify",
  description: "Upload or submit an image URL to Alttextify for alt text generation. [See the documentation](https://apidoc.alttextify.net/)",
  version: "0.0.1",
  type: "action",
  props: {
    alttextify,
    imageUrl: {
      propDefinition: [
        alttextify,
        "imageUrl",
      ],
    },
    imageType: {
      propDefinition: [
        alttextify,
        "imageType",
      ],
    },
    lang: {
      propDefinition: [
        alttextify,
        "lang",
      ],
      optional: true,
    },
    maxChars: {
      propDefinition: [
        alttextify,
        "maxChars",
      ],
      optional: true,
    },
    asyncOption: {
      propDefinition: [
        alttextify,
        "asyncOption",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.alttextify.uploadImageUrl({
      imageUrl: this.imageUrl,
      imageType: this.imageType,
      lang: this.lang,
      maxChars: this.maxChars,
      asyncOption: this.asyncOption,
    });

    $.export("$summary", `Successfully submitted image to Alttextify for alt text generation with Asset ID: ${response.asset_id}`);
    return response;
  },
};

import { axios } from "@pipedream/platform";
import { defineAction } from "@pipedream/types";
import app from "../../app/zoho_catalyst.app";

export default defineAction({
  key: "zoho_catalyst-extract-text-from-image",
  name: "Extract Text from Image",
  description: `Extract text from an image. [See the documentation](https://catalyst.zoho.com/help/api/zia/ocr.html)`,
  version: "0.0.1",
  type: "action",
  props: {
    app
    imageData: {
      type: "string",
      label: "Image Data",
      description: "The data of the image to extract text from",
    },
  },
  async run({ $ }) {
  },
});
import letzai from "../../letzai.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "letzai-get-image-information",
  name: "Get Image Information",
  description: "Retrieves information about a specific image by ID. [See the documentation](https://api.letz.ai/docs/api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    letzai,
    imageId: {
      propDefinition: [
        letzai,
        "imageId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.letzai.retrieveImageInfo(this.imageId);
    $.export("$summary", `Successfully retrieved information for image ID: ${this.imageId}`);
    return response;
  },
};

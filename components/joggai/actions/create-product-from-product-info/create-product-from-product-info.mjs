import {
  checkResponse,
  prepareAdditionalProps,
  prepareMediaData,
} from "../../common/utils.mjs";
import joggai from "../../joggai.app.mjs";

export default {
  key: "joggai-create-product-from-product-info",
  name: "Create Product from Product Info",
  description: "Creates a product from product info using JoggAI API. [See the documentation](https://docs.jogg.ai/api-reference/URL-to-Video/CreateVideo)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    joggai,
    name: {
      propDefinition: [
        joggai,
        "name",
      ],
    },
    description: {
      propDefinition: [
        joggai,
        "description",
      ],
    },
    targetAudience: {
      propDefinition: [
        joggai,
        "targetAudience",
      ],
    },
    mediaQuantity: {
      propDefinition: [
        joggai,
        "mediaQuantity",
      ],
    },
  },
  async additionalProps() {
    return prepareAdditionalProps(this);
  },
  async run({ $ }) {
    const mediaData = await prepareMediaData(this);

    const response = await this.joggai.createProduct({
      $,
      data: mediaData,
    });

    checkResponse(response);

    $.export("$summary", "Product created from product info successfully");
    return response;
  },
};

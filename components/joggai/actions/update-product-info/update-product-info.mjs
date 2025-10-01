import {
  checkResponse,
  prepareMediaData,
} from "../../common/utils.mjs";
import joggai from "../../joggai.app.mjs";

export default {
  key: "joggai-update-product-info",
  name: "Update Product Info",
  description: "Updates product info using JoggAI API. [See the documentation](https://docs.jogg.ai/api-reference/URL-to-Video/UpdateProduct)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    joggai,
    productId: {
      type: "string",
      label: "Product ID",
      description: "Product ID obtained from **Create Product Action** response.",
    },
    name: {
      propDefinition: [
        joggai,
        "name",
      ],
      optional: true,
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
  },
  async run({ $ }) {
    const mediaData = await prepareMediaData(this, {
      product_id: this.productId,
    });

    const response = await this.joggai.updateProduct({
      $,
      data: mediaData,
    });

    checkResponse(response);

    $.export("$summary", "Product info updated successfully");
    return response;
  },
};

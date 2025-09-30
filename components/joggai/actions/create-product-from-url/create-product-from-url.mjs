import { checkResponse } from "../../common/utils.mjs";
import joggai from "../../joggai.app.mjs";

export default {
  key: "joggai-create-product-from-url",
  name: "Create Product from URL",
  description: "Creates a product from a URL using JoggAI API. [See the documentation](https://docs.jogg.ai/api-reference/URL-to-Video/UploadURL)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    joggai,
    url: {
      type: "string",
      label: "Product URL",
      description: "URL of the product to crawl.",
    },
  },
  async run({ $ }) {
    const response = await this.joggai.createProduct({
      $,
      data: {
        url: this.url,
      },
    });

    checkResponse(response);

    $.export("$summary", `Product created from URL successfully with ID: ${response.data.product_id}`);
    return response;
  },
};

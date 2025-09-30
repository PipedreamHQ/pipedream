import akeneo from "../../akeneo.app.mjs";

export default {
  key: "akeneo-get-draft",
  name: "Get Draft",
  description: "Get a product draft from Akeneo. [See the documentation](https://api.akeneo.com/api-reference.html#get_draft__code_)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    akeneo,
    productId: {
      propDefinition: [
        akeneo,
        "productId",
      ],
      description: "Identifier of the product to get the draft for",
    },
  },
  async run({ $ }) {
    const response = await this.akeneo.getProductDraft({
      $,
      productId: this.productId,
    });
    $.export("$summary", `Found draft for product ${this.productId}`);
    return response;
  },
};

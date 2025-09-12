import akeneo from "../../akeneo.app.mjs";

export default {
  key: "akeneo-submit-product-for-approval",
  name: "Submit Product For Approval",
  description: "Submit a product for approval. [See the documentation](https://api.akeneo.com/api-reference.html#post_proposal)",
  version: "0.0.1",
  type: "action",
  props: {
    akeneo,
    productId: {
      propDefinition: [
        akeneo,
        "productId",
      ],
      description: "Identifier of the product to submit for approval",
    },
  },
  async run({ $ }) {
    const response = await this.akeneo.submitDraft({
      $,
      productId: this.productId,
    });
    $.export("$summary", `Successfully submitted product ${this.productId} for approval`);
    return response;
  },
};

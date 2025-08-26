import akeneo from "../../akeneo.app.mjs";

export default {
  key: "akeneo-get-product",
  name: "Get Product",
  description: "Get a product from Akeneo. [See the documentation](https://api.akeneo.com/api-reference.html#get_products__code_)",
  version: "0.0.1",
  type: "action",
  props: {
    akeneo,
    productId: {
      propDefinition: [
        akeneo,
        "productId",
      ],
      description: "Identifier of the product to get",
    },
    withAttributeOptions: {
      propDefinition: [
        akeneo,
        "withAttributeOptions",
      ],
    },
    withAssetShareLinks: {
      propDefinition: [
        akeneo,
        "withAssetShareLinks",
      ],
    },
    withQualityScores: {
      propDefinition: [
        akeneo,
        "withQualityScores",
      ],
    },
    withCompletenesses: {
      propDefinition: [
        akeneo,
        "withCompletenesses",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.akeneo.getProduct({
      $,
      productId: this.productId,
      params: {
        with_attribute_options: this.withAttributeOptions,
        with_asset_share_links: this.withAssetShareLinks,
        with_quality_scores: this.withQualityScores,
        with_completenesses: this.withCompletenesses,
      },
    });

    $.export("$summary", `Found product ${response.identifier}`);
    return response;
  },
};

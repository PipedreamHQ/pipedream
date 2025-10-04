import veedea from "../../veedea.app.mjs";

export default {
  key: "veedea-list-product-purchases",
  name: "List Product Purchases",
  description: "Retrieves a list of leads who purchased products through the specified campaign. [See the documentation](https://veedea.com/api/doc)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    veedea,
    campaignId: {
      propDefinition: [
        veedea,
        "campaignId",
      ],
    },
    maxResults: {
      propDefinition: [
        veedea,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const token = await this.veedea.getToken();
    const productPurchases = await this.veedea.getPaginatedResources({
      fn: this.veedea.listProductPurchases,
      args: {
        $,
        token,
        params: {
          campaign_id: this.campaignId,
        },
      },
      max: this.maxResults,
    });
    $.export("$summary", `Successfully retrieved ${productPurchases.length} product purchases`);
    return productPurchases;
  },
};

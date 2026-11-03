import ebay from "../../ebay.app.mjs";

export default {
  key: "ebay-get-offer",
  name: "Get Offer",
  description: "Retrieves details of an existing eBay offer (pricing, marketplace, policies, status) by Offer ID without modifying any data. Use this action to inspect and verify an unpublished offer before publishing it as a live listing. [See the documentation](https://developer.ebay.com/api-docs/sell/inventory/resources/offer/methods/getOffer)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ebay,
    offerId: {
      propDefinition: [
        ebay,
        "offerId",
      ],
    },
  },
  /**
   * Action run handler that retrieves details of an eBay offer by Offer ID.
   *
   * @param {object} ctx - Step execution context.
   * @param {object} ctx.$ - Pipedream step execution object.
   * @returns {Promise<object>} The offer record.
   */
  async run({ $ }) {
    const { offerId } = this;

    const response = await this.ebay.getOffer({
      $,
      offerId,
    });

    $.export("$summary", `Successfully retrieved offer with ID: ${offerId}`);

    return response;
  },
};

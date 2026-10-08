import { getListingUrl } from "../../common/utils.mjs";
import ebay from "../../ebay.app.mjs";

export default {
  key: "ebay-publish-offer",
  name: "Publish Offer",
  description: "Publishes an unpublished offer to convert it into an active, live eBay marketplace listing. Requires an `offerId` from **Create Unpublished Offer**. Returns the created listing ID and active eBay item URL. [See the documentation](https://developer.ebay.com/api-docs/sell/inventory/resources/offer/methods/publishOffer)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ebay,
    offerId: {
      propDefinition: [
        ebay,
        "offerId",
      ],
    },
    marketplaceId: {
      propDefinition: [
        ebay,
        "marketplaceId",
      ],
      optional: true,
    },
  },
  /**
   * Action run handler that publishes an eBay offer into an active listing.
   * Retrieves the offer's marketplace ID if not explicitly specified by the user.
   *
   * @param {object} ctx - Step execution context.
   * @param {object} ctx.$ - Pipedream step execution object.
   * @returns {Promise<object>} The publish response containing listingId and listingUrl.
   */
  async run({ $ }) {
    const {
      offerId,
      marketplaceId,
    } = this;

    let targetMarketplaceId = marketplaceId;
    if (!targetMarketplaceId) {
      try {
        const offer = await this.ebay.getOffer({
          $,
          offerId,
        });
        targetMarketplaceId = offer?.marketplaceId;
      } catch {
        // Fallback gracefully if offer lookup fails
      }
    }
    targetMarketplaceId = targetMarketplaceId || "EBAY_US";

    const response = await this.ebay.publishOffer({
      $,
      offerId,
    });

    const listingId = response?.listingId;
    const listingUrl = listingId
      ? getListingUrl(listingId, targetMarketplaceId)
      : undefined;

    $.export(
      "$summary",
      listingId
        ? `Successfully published offer ${offerId} as listing ID: ${listingId}`
        : `Successfully published offer ${offerId}`,
    );

    return {
      listingId,
      listingUrl,
      ...response,
    };
  },
};

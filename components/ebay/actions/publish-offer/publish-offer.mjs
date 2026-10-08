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
  async run({ $ }) {
    const {
      offerId,
      marketplaceId = "EBAY_US",
    } = this;

    const response = await this.ebay.publishOffer({
      $,
      offerId,
    });

    const listingId = response?.listingId;
    const listingUrl = listingId
      ? getListingUrl(listingId, marketplaceId)
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

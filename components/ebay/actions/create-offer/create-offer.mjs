import constants from "../../common/constants.mjs";
import { cleanObject } from "../../common/utils.mjs";
import ebay from "../../ebay.app.mjs";

export default {
  key: "ebay-create-offer",
  name: "Create Unpublished Offer",
  description: "Creates an unpublished fixed-price offer for an existing inventory item SKU on a specified eBay marketplace. The offer remains strictly unpublished and draft until explicitly published. Returns an `offerId` which can be reviewed with **Get Offer** and published as a live listing with **Publish Offer**. [See the documentation](https://developer.ebay.com/api-docs/sell/inventory/resources/offer/methods/createOffer)",
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
    sku: {
      propDefinition: [
        ebay,
        "sku",
      ],
    },
    marketplaceId: {
      propDefinition: [
        ebay,
        "marketplaceId",
      ],
    },
    categoryId: {
      propDefinition: [
        ebay,
        "categoryId",
      ],
    },
    price: {
      type: "string",
      label: "Price",
      description: "The listing price for the item (e.g. `29.99`).",
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "The 3-letter ISO currency code (e.g. `USD`, `GBP`, `EUR`).",
      options: constants.CURRENCY_OPTIONS,
      default: "USD",
    },
    availableQuantity: {
      type: "integer",
      label: "Available Quantity",
      description: "The quantity of items offered in this listing. If omitted, uses the quantity from the inventory item.",
      optional: true,
    },
    merchantLocationKey: {
      propDefinition: [
        ebay,
        "merchantLocationKey",
      ],
    },
    fulfillmentPolicyId: {
      propDefinition: [
        ebay,
        "fulfillmentPolicyId",
        ({ marketplaceId }) => ({
          marketplaceId,
        }),
      ],
    },
    paymentPolicyId: {
      propDefinition: [
        ebay,
        "paymentPolicyId",
        ({ marketplaceId }) => ({
          marketplaceId,
        }),
      ],
    },
    returnPolicyId: {
      propDefinition: [
        ebay,
        "returnPolicyId",
        ({ marketplaceId }) => ({
          marketplaceId,
        }),
      ],
    },
    listingDescription: {
      type: "string",
      label: "Listing Description",
      description: "Custom description for the listing. If omitted, eBay uses the inventory item description.",
      optional: true,
    },
    quantityLimitPerBuyer: {
      type: "integer",
      label: "Quantity Limit Per Buyer",
      description: "The maximum number of items that a single buyer can purchase.",
      optional: true,
    },
    vatPercentage: {
      type: "string",
      label: "VAT Percentage",
      description: "The Value-Added Tax (VAT) percentage applied to the item.",
      optional: true,
    },
    contentLanguage: {
      propDefinition: [
        ebay,
        "contentLanguage",
      ],
    },
  },
  async run({ $ }) {
    const {
      sku,
      marketplaceId,
      categoryId,
      price,
      currency,
      availableQuantity,
      merchantLocationKey,
      fulfillmentPolicyId,
      paymentPolicyId,
      returnPolicyId,
      listingDescription,
      quantityLimitPerBuyer,
      vatPercentage,
      contentLanguage,
    } = this;

    const payload = cleanObject({
      sku,
      marketplaceId,
      format: "FIXED_PRICE",
      categoryId,
      pricingSummary: {
        price: {
          value: String(price),
          currency,
        },
      },
      availableQuantity: availableQuantity !== undefined
        ? Number(availableQuantity)
        : undefined,
      merchantLocationKey,
      listingPolicies: {
        fulfillmentPolicyId,
        paymentPolicyId,
        returnPolicyId,
      },
      listingDescription,
      quantityLimitPerBuyer: quantityLimitPerBuyer !== undefined
        ? Number(quantityLimitPerBuyer)
        : undefined,
      tax: vatPercentage
        ? {
          vatPercentage: Number(vatPercentage),
        }
        : undefined,
    });

    const response = await this.ebay.createOffer({
      $,
      contentLanguage,
      data: payload,
    });

    $.export("$summary", `Successfully created unpublished offer with ID: ${response.offerId} for SKU: ${sku}`);

    return response;
  },
};

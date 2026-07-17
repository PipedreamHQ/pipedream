import shopify from "../../shopify.app.mjs";
import { FULFILLMENT_HOLD_REASONS } from "../../common/constants.mjs";

export default {
  key: "shopify-hold-fulfillment-order",
  name: "Hold Fulfillment Order",
  description: "Places a fulfillment order on hold. Run **Search for Orders** and inspect the order's fulfillment orders to obtain the fulfillment order GID. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/fulfillmentOrderHold).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    shopify,
    fulfillmentOrderId: {
      propDefinition: [
        shopify,
        "fulfillmentOrderId",
      ],
    },
    reason: {
      type: "string",
      label: "Reason",
      description: "The reason for the hold. One of the Shopify `FulfillmentHoldReason` values, e.g. `AWAITING_PAYMENT`, `INCORRECT_ADDRESS`, or `INVENTORY_OUT_OF_STOCK`.",
      options: FULFILLMENT_HOLD_REASONS,
    },
    reasonNotes: {
      type: "string",
      label: "Reason Notes",
      description: "Free-form notes explaining the hold reason.",
      optional: true,
    },
    notifyMerchant: {
      type: "boolean",
      label: "Notify Merchant",
      description: "Whether to notify the merchant about the hold.",
      default: false,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.shopify.holdFulfillmentOrder({
      id: this.fulfillmentOrderId,
      fulfillmentHold: {
        reason: this.reason,
        reasonNotes: this.reasonNotes,
        notifyMerchant: this.notifyMerchant,
      },
    });

    if (response.fulfillmentOrderHold?.userErrors?.length > 0) {
      throw new Error(response.fulfillmentOrderHold.userErrors.map(({ message }) => message).join(", "));
    }

    const { fulfillmentOrder } = response.fulfillmentOrderHold ?? {};
    $.export("$summary", `Fulfillment order \`${fulfillmentOrder?.id}\` placed on hold - status: \`${fulfillmentOrder?.status}\``);
    return response;
  },
};

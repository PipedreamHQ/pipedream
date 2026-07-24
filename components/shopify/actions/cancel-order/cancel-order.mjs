import { ConfigurationError } from "@pipedream/platform";
import shopify from "../../shopify.app.mjs";
import { ORDER_CANCEL_REASONS } from "../../common/constants.mjs";

export default {
  key: "shopify-cancel-order",
  name: "Cancel Order",
  description: "Cancel an existing order. Run **Search for Orders** first to obtain the order GID. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/orderCancel)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    shopify,
    orderId: {
      type: "string",
      label: "Order ID",
      description: "The GID of the order to cancel, e.g. `gid://shopify/Order/820982911946154508`. Run **Search for Orders** first to find the order ID.",
    },
    reason: {
      type: "string",
      label: "Reason",
      description: "The reason for cancelling the order. One of `CUSTOMER`, `DECLINED`, `FRAUD`, `INVENTORY`, `OTHER`, `STAFF`.",
      options: ORDER_CANCEL_REASONS,
    },
    restock: {
      type: "boolean",
      label: "Restock",
      description: "Whether to restock the inventory committed to the order.",
      default: false,
    },
    notifyCustomer: {
      type: "boolean",
      label: "Notify Customer",
      description: "Whether to send a notification to the customer about the cancellation.",
      optional: true,
    },
    staffNote: {
      type: "string",
      label: "Staff Note",
      description: "An optional staff note about the cancellation (max 255 characters, not visible to the customer). Maps to the `staffNote` mutation argument.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.staffNote && this.staffNote.length > 255) {
      throw new ConfigurationError("Staff note must be less than 255 characters");
    }

    const response = await this.shopify.cancelOrder({
      orderId: this.orderId,
      reason: this.reason,
      restock: this.restock,
      notifyCustomer: this.notifyCustomer,
      staffNote: this.staffNote,
    });

    if (response.orderCancel.orderCancelUserErrors?.length) {
      throw new Error(response.orderCancel.orderCancelUserErrors[0].message);
    }

    $.export("$summary", `Successfully enqueued cancellation of order ${this.orderId}`);
    return response;
  },
};

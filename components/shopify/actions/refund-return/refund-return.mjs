import { ConfigurationError } from "@pipedream/platform";
import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-refund-return",
  name: "Refund Return",
  description: "Creates a refund for an existing return. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/returnRefund).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    shopify,
    returnId: {
      type: "string",
      label: "Return ID",
      description: "The return GID to refund, in the format `gid://shopify/Return/222`. Obtain this from the **Create Return** action output or by inspecting an order's returns.",
    },
    returnRefundLineItems: {
      type: "string",
      label: "Return Refund Line Items",
      description: "JSON array of return line items to refund. Each item accepts `returnLineItemId` (GID) and `quantity`. Example: `[{\"returnLineItemId\": \"gid://shopify/ReturnLineItem/333\", \"quantity\": 1}]`.",
    },
    notifyCustomer: {
      type: "boolean",
      label: "Notify Customer",
      description: "Whether to notify the customer about the refund.",
      default: false,
      optional: true,
    },
    additionalRefundFields: {
      type: "object",
      label: "Additional Refund Fields",
      description: "JSON object of additional fields (e.g. `orderTransactions`, `refundDuties`, or `refundShipping`). Example: `{\"refundShipping\": {\"fullRefund\": true}}`.",
      optional: true,
    },
  },
  async run({ $ }) {
    let returnRefundLineItems;
    try {
      returnRefundLineItems = JSON.parse(this.returnRefundLineItems);
    } catch {
      throw new ConfigurationError("`Return Refund Line Items` must be valid JSON.");
    }

    const returnRefundInput = {
      ...(this.additionalRefundFields || {}),
      returnId: this.returnId,
      returnRefundLineItems,
      notifyCustomer: this.notifyCustomer,
    };

    const response = await this.shopify.refundReturn({
      returnRefundInput,
    });

    if (response.returnRefund?.userErrors?.length > 0) {
      throw new Error(response.returnRefund.userErrors.map(({ message }) => message).join(", "));
    }

    const { refund } = response.returnRefund ?? {};
    $.export("$summary", `Created refund \`${refund?.id}\` for return \`${this.returnId}\``);
    return response;
  },
};

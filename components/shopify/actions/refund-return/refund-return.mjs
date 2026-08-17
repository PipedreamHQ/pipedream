import { ConfigurationError } from "@pipedream/platform";
import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-refund-return",
  name: "Refund Return",
  description: "Processes an existing return in Shopify via the `returnProcess` mutation, marking the specified return line items as processed. By default no refund is issued — to also issue a refund, include a `financialTransfer` object with an `issueRefund` operation (and its required `orderTransactions`) in **Additional Fields**. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/returnProcess).",
  version: "0.1.1",
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
    returnLineItems: {
      type: "string",
      label: "Return Line Items",
      description: "JSON array of return line items to process. Each item accepts `id` (the ReturnLineItem GID) and `quantity`. Example: `[{\"id\": \"gid://shopify/ReturnLineItem/333\", \"quantity\": 1}]`.",
    },
    notifyCustomer: {
      type: "boolean",
      label: "Notify Customer",
      description: "Whether to notify the customer about the refund.",
      default: false,
      optional: true,
    },
    additionalFields: {
      type: "object",
      label: "Additional Fields",
      description: "JSON object of additional `ReturnProcessInput` fields (e.g. `refundShipping`, `refundDuties`, `note`, or `financialTransfer` to issue a refund). Example: `{\"refundShipping\": {\"fullRefund\": true}}`.",
      optional: true,
    },
  },
  async run({ $ }) {
    let returnLineItems;
    try {
      returnLineItems = JSON.parse(this.returnLineItems);
    } catch {
      throw new ConfigurationError("`Return Line Items` must be valid JSON.");
    }
    if (!Array.isArray(returnLineItems) || returnLineItems.length === 0) {
      throw new ConfigurationError("`Return Line Items` must be a non-empty JSON array of objects.");
    }
    for (const item of returnLineItems) {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        throw new ConfigurationError("Each return line item must be an object with `id` and `quantity`.");
      }
      if (!item.id) {
        throw new ConfigurationError("Each return line item requires a non-null `id` (the ReturnLineItem GID).");
      }
      if (!Number.isInteger(item.quantity)) {
        throw new ConfigurationError("Each return line item requires an integer `quantity`.");
      }
    }

    const input = {
      ...(this.additionalFields || {}),
      returnId: this.returnId,
      returnLineItems,
      notifyCustomer: this.notifyCustomer,
    };

    const response = await this.shopify.processReturn({
      input,
    });

    if (response.returnProcess?.userErrors?.length > 0) {
      throw new Error(response.returnProcess.userErrors.map(({ message }) => message).join(", "));
    }

    $.export("$summary", `Processed return \`${response?.returnProcess?.return?.id ?? this.returnId}\``);
    return response;
  },
};

import { ConfigurationError } from "@pipedream/platform";
import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-create-return",
  name: "Create Return",
  description: "Creates a return for an order. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/returnCreate).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    shopify,
    orderId: {
      propDefinition: [
        shopify,
        "orderId",
      ],
    },
    returnLineItems: {
      type: "string",
      label: "Return Line Items",
      description: "JSON array of return line items. Each item requires `fulfillmentLineItemId` (GID), `quantity`, and `returnReason` (a required `ReturnReason` enum value: `UNKNOWN`, `DEFECTIVE`, `NOT_AS_DESCRIBED`, `WRONG_ITEM`, `UNWANTED`, `SIZE_TOO_SMALL`, `SIZE_TOO_LARGE`, `STYLE`, `COLOR`, or `OTHER`). When `returnReason` is `OTHER`, also provide `returnReasonNote`. Example: `[{\"fulfillmentLineItemId\": \"gid://shopify/FulfillmentLineItem/111\", \"quantity\": 1, \"returnReason\": \"UNKNOWN\"}]`.",
    },
    additionalReturnFields: {
      type: "object",
      label: "Additional Return Fields",
      description: "JSON object of additional fields such as `exchangeLineItems`, `requestedAt`, or `returnShippingFee`. Example: `{\"requestedAt\": \"2026-01-15T00:00:00Z\"}`.",
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

    const returnInput = {
      ...(this.additionalReturnFields || {}),
      orderId: this.orderId,
      returnLineItems,
    };

    const response = await this.shopify.createReturn({
      returnInput,
    });

    if (response.returnCreate?.userErrors?.length > 0) {
      throw new Error(response.returnCreate.userErrors.map(({ message }) => message).join(", "));
    }

    const createdReturn = response.returnCreate?.return;
    $.export("$summary", `Created return \`${createdReturn?.id}\` for order \`${this.orderId}\``);
    return response;
  },
};

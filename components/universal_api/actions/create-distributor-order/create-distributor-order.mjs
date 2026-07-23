import app from "../../universal_api.app.mjs";

export default {
  key: "universal_api-create-distributor-order",
  name: "Create Distributor Order",
  description:
    "Create a new order via the Distributors API on Universal API. Use **List Distributor Products** to discover valid product identifiers for the order items. [See the documentation](https://docs.universalapi.io/reference/create-order).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    consumerId: {
      propDefinition: [
        app,
        "consumerId",
      ],
    },
    contactEmail: {
      type: "string",
      label: "Contact Email",
      description: "Contact email for the order.",
    },
    customerIdentifier: {
      type: "string",
      label: "Customer Identifier",
      description: "Customer identifier for the order.",
      optional: true,
    },
    referenceIdentifier: {
      type: "string",
      label: "Reference Identifier",
      description: "Your reference identifier for the order.",
      optional: true,
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "Free-text comment for the order.",
      optional: true,
    },
    shippingAddress: {
      type: "object",
      label: "Shipping Address",
      description:
        "Shipping address object. Keys: `companyName`, `address1`, `address2`, `city`, `postalCode`, `countryCode`, `phoneNumber`. Example: `{\"companyName\":\"Acme\",\"address1\":\"1 Main St\",\"city\":\"Oslo\",\"postalCode\":\"0150\",\"countryCode\":\"NO\",\"phoneNumber\":\"+4790000000\"}`.",
    },
    billingAddress: {
      type: "object",
      label: "Billing Address",
      description:
        "Billing address object with the same keys as `shippingAddress`. Example: `{\"companyName\":\"Acme\",\"address1\":\"1 Main St\",\"city\":\"Oslo\",\"postalCode\":\"0150\",\"countryCode\":\"NO\",\"phoneNumber\":\"+4790000000\"}`.",
      optional: true,
    },
    orderItems: {
      type: "string",
      label: "Order Items",
      description:
        "JSON array of order items. Each item: `{itemNumber, referenceIdentifier, sku, quantity, vpn, comment}`. Example: `[{\"itemNumber\":\"ABC123\",\"sku\":\"SKU1\",\"quantity\":2,\"vpn\":\"VPN1\"}]`.",
    },
  },
  async run({ $ }) {
    const orderItems = JSON.parse(this.orderItems);
    const response = await this.app.createDistributorOrder({
      $,
      consumerId: this.consumerId,
      data: {
        contactEmail: this.contactEmail,
        customerIdentifier: this.customerIdentifier,
        referenceIdentifier: this.referenceIdentifier,
        comment: this.comment,
        shippingAddress: this.shippingAddress,
        billingAddress: this.billingAddress,
        orderItems,
      },
    });
    $.export("$summary", `Successfully created distributor order${response.data?.id
      ? ` ${response.data.id}`
      : ""}`);
    return response;
  },
};

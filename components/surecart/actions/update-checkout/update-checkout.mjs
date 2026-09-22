import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-update-checkout",
  name: "Update Checkout",
  description: "Update an existing checkout session. [See the documentation](https://developer.surecart.com/api-reference/checkouts/update)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    surecart,
    checkoutId: {
      propDefinition: [
        surecart,
        "checkoutId",
      ],
    },
    refreshLineItems: {
      type: "boolean",
      label: "Refresh Line Items",
      description: "Refresh all line item prices to their most recent versions.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Customer email address. Example: `customer@example.com`",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Full or business name. Example: `Acme Corp`",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Customer first name. Example: `Jane`",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Customer last name. Example: `Doe`",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Customer phone number. Example: `+15551234567`",
      optional: true,
    },
    customer: {
      propDefinition: [
        surecart,
        "customerId",
      ],
    },
    taxEnabled: {
      type: "boolean",
      label: "Tax Enabled",
      description: "Enable or disable tax calculation.",
      optional: true,
    },
    taxBehavior: {
      type: "string",
      label: "Tax Behavior",
      description: "Whether tax is included in or added on top of the price.",
      optional: true,
      options: [
        "exclusive",
        "inclusive",
      ],
    },
    billingMatchesShipping: {
      type: "boolean",
      label: "Billing Matches Shipping",
      description: "Use the shipping address as the billing address.",
      optional: true,
    },
    abandonedCheckoutEnabled: {
      type: "boolean",
      label: "Abandoned Checkout Enabled",
      description: "Enable or disable abandoned checkout recovery for this session.",
      optional: true,
    },
    billingAddress: {
      type: "object",
      label: "Billing Address",
      description: "Updated billing address. Example: `{ \"city\": \"New York\", \"country\": \"US\", \"line_1\": \"123 Main St\", \"postal_code\": \"10001\", \"state\": \"NY\" }`",
      optional: true,
    },
    shippingAddress: {
      type: "object",
      label: "Shipping Address",
      description: "Updated shipping address. Example: `{ \"city\": \"New York\", \"country\": \"US\", \"line_1\": \"123 Main St\", \"postal_code\": \"10001\", \"state\": \"NY\" }`",
      optional: true,
    },
    lineItems: {
      type: "string",
      label: "Line Items",
      description: "Updated line items. Example: `[{ \"price\": \"price_abc123\", \"quantity\": 2 }]`",
      optional: true,
    },
    discount: {
      type: "object",
      label: "Discount",
      description: "Updated coupon or promotion code. Example: `{ \"coupon\": \"coup_abc123\" }`",
      optional: true,
    },
    taxIdentifier: {
      type: "object",
      label: "Tax Identifier",
      description: "Updated tax ID object. Example: `{ \"number\": \"123456789\", \"number_type\": \"eu_vat\" }`",
      optional: true,
    },
    selectedShippingChoice: {
      type: "string",
      label: "Selected Shipping Choice ID",
      description: "UUID of the selected shipping option. Example: `sc_abc123`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.surecart.updateCheckout({
      $,
      checkoutId: this.checkoutId,
      params: {
        refresh_line_items: this.refreshLineItems,
      },
      data: {
        checkout: {
          email: this.email,
          name: this.name,
          first_name: this.firstName,
          last_name: this.lastName,
          phone: this.phone,
          customer: this.customer,
          tax_enabled: this.taxEnabled,
          tax_behavior: this.taxBehavior,
          billing_matches_shipping: this.billingMatchesShipping,
          abandoned_checkout_enabled: this.abandonedCheckoutEnabled,
          billing_address: this.billingAddress,
          shipping_address: this.shippingAddress,
          line_items: this.lineItems
            ? JSON.parse(this.lineItems)
            : undefined,
          discount: this.discount,
          tax_identifier: this.taxIdentifier,
          selected_shipping_choice: this.selectedShippingChoice,
        },
      },
    });
    $.export("$summary", `Successfully updated checkout ${this.checkoutId}`);
    return response;
  },
};

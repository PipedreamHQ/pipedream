import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-create-checkout",
  name: "Create Checkout",
  description: "Create a new checkout session. [See the documentation](https://developer.surecart.com/api-reference/checkouts/create)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    surecart,
    email: {
      type: "string",
      label: "Email",
      description: "Customer email address. Example: `customer@example.com`",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Full or business name (takes precedence over First/Last Name). Example: `Acme Corp`",
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
    currency: {
      type: "string",
      label: "Currency",
      description: "ISO 4217 currency code for this checkout. Example: `usd`",
      optional: true,
    },
    liveMode: {
      propDefinition: [
        surecart,
        "liveMode",
      ],
    },
    taxEnabled: {
      type: "boolean",
      label: "Tax Enabled",
      description: "Enable tax calculation for this checkout.",
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
      description: "Enable abandoned checkout recovery tracking for this session.",
      optional: true,
    },
    externalUrl: {
      type: "string",
      label: "External URL",
      description: "Custom redirect URL for the customer portal. Example: `https://mysite.com/thank-you`",
      optional: true,
    },
    groupKey: {
      type: "string",
      label: "Group Key",
      description: "Dynamic grouping identifier for this checkout. Example: `campaign_summer_2024`",
      optional: true,
    },
    billingAddress: {
      type: "object",
      label: "Billing Address",
      description: "Billing address object. Example: `{ \"city\": \"New York\", \"country\": \"US\", \"line_1\": \"123 Main St\", \"postal_code\": \"10001\", \"state\": \"NY\" }`",
      optional: true,
    },
    shippingAddress: {
      type: "object",
      label: "Shipping Address",
      description: "Shipping address object. Example: `{ \"city\": \"New York\", \"country\": \"US\", \"line_1\": \"123 Main St\", \"postal_code\": \"10001\", \"state\": \"NY\" }`",
      optional: true,
    },
    lineItems: {
      type: "string",
      label: "Line Items",
      description: "Initial line items for this checkout. Each item requires a `price` UUID. Example: `[{ \"price\": \"price_abc123\", \"quantity\": 1 }]`",
      optional: true,
    },
    discount: {
      type: "object",
      label: "Discount",
      description: "Coupon or promotion code to apply. Example: `{ \"coupon\": \"coup_abc123\" }`",
      optional: true,
    },
    taxIdentifier: {
      type: "object",
      label: "Tax Identifier",
      description: "Tax ID object with `number` and `number_type`. Example: `{ \"number\": \"123456789\", \"number_type\": \"eu_vat\" }`",
      optional: true,
    },
    selectedShippingChoice: {
      type: "string",
      label: "Selected Shipping Choice ID",
      description: "UUID of the pre-selected shipping option. Example: `sc_abc123`",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Additional key-value metadata. Example: `{ \"source\": \"email_campaign\" }`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.surecart.createCheckout({
      $,
      data: {
        checkout: {
          email: this.email,
          name: this.name,
          first_name: this.firstName,
          last_name: this.lastName,
          phone: this.phone,
          customer: this.customer,
          currency: this.currency,
          live_mode: this.liveMode,
          tax_enabled: this.taxEnabled,
          tax_behavior: this.taxBehavior,
          billing_matches_shipping: this.billingMatchesShipping,
          abandoned_checkout_enabled: this.abandonedCheckoutEnabled,
          external_url: this.externalUrl,
          group_key: this.groupKey,
          billing_address: this.billingAddress,
          shipping_address: this.shippingAddress,
          line_items: this.lineItems
            ? JSON.parse(this.lineItems)
            : undefined,
          discount: this.discount,
          tax_identifier: this.taxIdentifier,
          selected_shipping_choice: this.selectedShippingChoice,
          metadata: this.metadata,
        },
      },
    });
    $.export("$summary", `Successfully created checkout ${response.id}`);
    return response;
  },
};

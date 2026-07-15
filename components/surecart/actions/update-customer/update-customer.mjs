import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-update-customer",
  name: "Update Customer",
  description: "Update an existing customer. [See the documentation](https://developer.surecart.com/api-reference/customers/update)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    surecart,
    customerId: {
      propDefinition: [
        surecart,
        "customerId",
      ],
    },
    cascadeDefaultPaymentMethod: {
      type: "boolean",
      label: "Cascade Default Payment Method",
      description: "Set to `true` to cascade the default payment method to all subscriptions belonging to this customer.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Full or business name (takes precedence over First Name / Last Name). Example: `Acme Corp`",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The customer's first name. Example: `Jane`",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The customer's last name. Example: `Doe`",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The customer's email address. Example: `customer@example.com`",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The customer's phone number. Example: `+15551234567`",
      optional: true,
    },
    billingMatchesShipping: {
      type: "boolean",
      label: "Billing Matches Shipping",
      description: "Set to `true` to use the shipping address as the billing address.",
      optional: true,
    },
    taxEnabled: {
      type: "boolean",
      label: "Tax Enabled",
      description: "Enable or disable tax calculation for this customer.",
      optional: true,
    },
    unsubscribed: {
      type: "boolean",
      label: "Unsubscribed",
      description: "Set to `true` to mark the customer as unsubscribed from opt-in emails.",
      optional: true,
    },
    affiliation: {
      type: "string",
      label: "Affiliation",
      description: "Affiliation ID to associate with this customer. Example: `aff_abc123`",
      optional: true,
    },
    defaultPaymentMethod: {
      type: "string",
      label: "Default Payment Method",
      description: "UUID of the default payment method for this customer. Example: `pm_abc123`",
      optional: true,
    },
    billingAddress: {
      type: "object",
      label: "Billing Address",
      description: "The customer's billing address. Example: `{ \"city\": \"New York\", \"country\": \"US\", \"line_1\": \"123 Main St\", \"line_2\": \"Apt 1\", \"name\": \"Jane Doe\", \"postal_code\": \"10001\", \"state\": \"NY\" }`",
      optional: true,
    },
    shippingAddress: {
      type: "object",
      label: "Shipping Address",
      description: "The customer's shipping address. Example: `{ \"city\": \"New York\", \"country\": \"US\", \"line_1\": \"123 Main St\", \"line_2\": \"Apt 1\", \"name\": \"Jane Doe\", \"postal_code\": \"10001\", \"state\": \"NY\" }`",
      optional: true,
    },
    taxIdentifier: {
      type: "object",
      label: "Tax Identifier",
      description: "Tax identifier object with `number` and `number_type` fields. Example: `{ \"number\": \"123456789\", \"number_type\": \"eu_vat\" }`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.surecart.updateCustomer({
      $,
      customerId: this.customerId,
      params: {
        cascade_default_payment_method: this.cascadeDefaultPaymentMethod,
      },
      data: {
        customer: {
          name: this.name,
          first_name: this.firstName,
          last_name: this.lastName,
          email: this.email,
          phone: this.phone,
          billing_matches_shipping: this.billingMatchesShipping,
          tax_enabled: this.taxEnabled,
          unsubscribed: this.unsubscribed,
          affiliation: this.affiliation,
          default_payment_method: this.defaultPaymentMethod,
          billing_address: this.billingAddress,
          shipping_address: this.shippingAddress,
          tax_identifier: this.taxIdentifier,
        },
      },
    });
    $.export("$summary", `Successfully updated customer ${this.customerId}`);
    return response;
  },
};

import corporateMerch from "../../corporate_merch.app.mjs";

export default {
  key: "corporate_merch-create-order",
  name: "Create Order",
  description: "Create a new order. [See the documentation](https://corporatemerch.readme.io/reference/create-orders)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    corporateMerch,
    info: {
      type: "alert",
      alertType: "info",
      content: "** If you receive an error message stating that the address is invalid and you know that the address is correct, utilize the skip_address_validation field. Corporate Merch uses a 3rd party address verification API that may be overly sensitive.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Customer's first name.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Customer's last name.",
    },
    company: {
      type: "string",
      label: "Company",
      description: "Business name (if applicable).",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Customer's phone number. Required for international orders.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Customer's email address. Required for international orders.",
      optional: true,
    },
    address1: {
      type: "string",
      label: "Address 1",
      description: "Primary street address.",
    },
    address2: {
      type: "string",
      label: "Address 2",
      description: "Secondary address line (e.g. apartment, suite).",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City for the shipping location.",
    },
    state: {
      type: "string",
      label: "State",
      description: "2-character code for USA states (e.g. `CA`).",
    },
    zipCode: {
      type: "string",
      label: "Zip Code",
      description: "Postal code.",
    },
    country: {
      type: "string",
      label: "Country",
      description: "2-character country code (e.g. `US`).",
    },
    products: {
      type: "string[]",
      label: "Products",
      description: "Items to include in the order. Each item must be a JSON string representing a product object with keys `product_id`, `quantity`, and optionally `variant_id`. Use the **List Products** action to retrieve available products and their IDs. Example: `[{\"product_id\": \"abc123\", \"quantity\": 2, \"variant_id\": \"xyz456\"}]`",
    },
    notecardMessage: {
      type: "string",
      label: "Notecard Message",
      description: "Custom message for an included notecard.",
      optional: true,
    },
    notecardUrl: {
      type: "string",
      label: "Notecard URL",
      description: "URL for the notecard. If provided, overrides Notecard Message.",
      optional: true,
    },
    shopifyOrderId: {
      type: "string",
      label: "Shopify Order ID",
      description: "External Shopify order reference identifier.",
      optional: true,
    },
    billingName: {
      type: "string",
      label: "Billing Name",
      description: "Billing contact name.",
      optional: true,
    },
    billingAddress1: {
      type: "string",
      label: "Billing Address 1",
      description: "Billing street address.",
      optional: true,
    },
    billingAddress2: {
      type: "string",
      label: "Billing Address 2",
      description: "Billing secondary address line.",
      optional: true,
    },
    billingZipCode: {
      type: "string",
      label: "Billing Zip Code",
      description: "Billing postal code.",
      optional: true,
    },
    billingCity: {
      type: "string",
      label: "Billing City",
      description: "Billing city.",
      optional: true,
    },
    billingState: {
      type: "string",
      label: "Billing State",
      description: "Billing state code.",
      optional: true,
    },
    skipAddressValidation: {
      type: "boolean",
      label: "Skip Address Validation",
      description: "Set to `true` to override address verification checks.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.corporateMerch.createOrder({
      $,
      data: {
        first_name: this.firstName,
        last_name: this.lastName,
        company: this.company,
        phone_number: this.phoneNumber,
        email: this.email,
        address1: this.address1,
        address2: this.address2,
        city: this.city,
        state: this.state,
        zip_code: this.zipCode,
        country: this.country,
        products: this.products.map((p) => typeof p === "string"
          ? JSON.parse(p)
          : p),
        notecard_message: this.notecardMessage,
        notecard_url: this.notecardUrl,
        shopify_order_id: this.shopifyOrderId,
        billing_name: this.billingName,
        billing_address_1: this.billingAddress1,
        billing_address_2: this.billingAddress2,
        billing_zip_code: this.billingZipCode,
        billing_city: this.billingCity,
        billing_state: this.billingState,
        skip_address_validation: this.skipAddressValidation,
      },
    });
    $.export("$summary", `Successfully created order with ID: ${response.data?.id}`);
    return response;
  },
};

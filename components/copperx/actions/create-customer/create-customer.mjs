import copperx from "../../copperx.app.mjs";

export default {
  key: "copperx-create-customer",
  name: "Create Customer",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new customer [See the documentation](https://copperx.readme.io/reference/customercontroller_create)",
  type: "action",
  props: {
    copperx,
    email: {
      type: "string",
      label: "Email",
      description: "The customer's email.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The customer's name.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The customer's phone.",
      optional: true,
    },
    addressLine1: {
      type: "string",
      label: "Address Line 1",
      description: "The customer's address line 1.",
    },
    addressLine2: {
      type: "string",
      label: "Address Line 2",
      description: "The customer's address line 2.",
      optional: true,
    },
    addressCity: {
      type: "string",
      label: "City",
      description: "The city of the customer's address.",
    },
    addressState: {
      type: "string",
      label: "State",
      description: "The state of the customer's address.",
    },
    addressPostalCode: {
      type: "string",
      label: "Postal Code",
      description: "The postal code of the customer's address.",
    },
    addressCountry: {
      type: "string",
      label: "Country",
      description: "The country of the customer's address.",
    },
    customerReferenceId: {
      type: "string",
      label: "Customer Reference Id.",
      description: "The customer's reference Id.",
      optional: true,
    },
    shippingAddressName: {
      type: "string",
      label: "Shipping Address Name",
      description: "The name of the shipping address receiver.",
      optional: true,
    },
    shippingAddressEmail: {
      type: "string",
      label: "Shipping Address Email",
      description: "The email of the shipping address.",
      optional: true,
    },
    shippingAddressPhone: {
      type: "string",
      label: "Shipping Address Phone",
      description: "The phone of the shipping address.",
      optional: true,
    },
    shippingAddressLine1: {
      type: "string",
      label: "Shipping Address Line 1",
      description: "The shipping address line 1.",
      optional: true,
    },
    shippingAddressLine2: {
      type: "string",
      label: "Shipping Address Line 2",
      description: "The shipping address line 2.",
      optional: true,
    },
    shippingAddressCity: {
      type: "string",
      label: "Shipping Address City",
      description: "The city of the shipping address.",
      optional: true,
    },
    shippingAddressState: {
      type: "string",
      label: "Shipping Address State",
      description: "The state of the shipping address.",
      optional: true,
    },
    shippingAddressPostalCode: {
      type: "string",
      label: "Shipping Address Postal Code",
      description: "The postal code of the shipping address.",
      optional: true,
    },
    shippingAddressCountry: {
      type: "string",
      label: "Shipping Address Country",
      description: "The country of the shipping address.",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Customer's metadata.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      copperx,
      addressLine1,
      addressLine2,
      addressCity,
      addressState,
      addressPostalCode,
      addressCountry,
      shippingAddressName,
      shippingAddressEmail,
      shippingAddressPhone,
      shippingAddressLine1,
      shippingAddressLine2,
      shippingAddressCity,
      shippingAddressState,
      shippingAddressPostalCode,
      shippingAddressCountry,
      ...data
    } = this;

    const response = await copperx.createCustomer({
      $,
      data: {
        "address": {
          "line1": addressLine1,
          "line2": addressLine2,
          "country": addressCountry,
          "postalCode": addressPostalCode,
          "state": addressState,
          "city": addressCity,
        },
        "shipping": {
          "address": {
            "country": shippingAddressCountry,
            "postalCode": shippingAddressPostalCode,
            "state": shippingAddressState,
            "city": shippingAddressCity,
            "line2": shippingAddressLine2,
            "line1": shippingAddressLine1,
          },
          "phone": shippingAddressPhone,
          "email": shippingAddressEmail,
          "name": shippingAddressName,
        },
        ...data,
      },
    });

    $.export("$summary", `A new customer with Id: ${response.id} was successfully created!`);
    return response;
  },
};

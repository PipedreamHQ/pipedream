import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-validate-address",
  name: "Validate Address",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Validate a shipping address. [See the documentation](https://sendoso.docs.apiary.io/#reference/address-management)",
  type: "action",
  props: {
    sendoso,
    address: {
      type: "string",
      label: "Address",
      description: "Street address to validate.",
    },
    city: {
      type: "string",
      label: "City",
      description: "City name.",
    },
    state: {
      type: "string",
      label: "State",
      description: "State/province code.",
    },
    zip: {
      type: "string",
      label: "ZIP Code",
      description: "Postal code.",
    },
    country: {
      type: "string",
      label: "Country",
      description: "Country code (e.g., USA).",
      optional: true,
      default: "USA",
    },
  },
  async run({ $ }) {
    const {
      address,
      city,
      state,
      zip,
      country,
    } = this;

    const response = await this.sendoso.validateAddress({
      $,
      address,
      city,
      state,
      zip,
      country,
    });

    const isValid = response.valid || response.is_valid || false;
    $.export("$summary", `Address validation ${isValid ?
      "succeeded" :
      "failed"}`);
    return response;
  },
};


// x-pd-ai: optimized
import bluesnap from "../../bluesnap.app.mjs";

export default {
  key: "bluesnap-create-vaulted-shopper",
  name: "Create Vaulted Shopper",
  description: "Create a vaulted shopper (stored customer) record in BlueSnap (POST /services/2/vaulted-shoppers). Returns a vaultedShopperId usable in **Create Transaction**, **Get Vaulted Shopper**, and **Update Vaulted Shopper**. [See the documentation](https://developers.bluesnap.com/v8976-JSON/reference/create-vaulted-shopper)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    bluesnap,
    firstName: {
      type: "string",
      label: "First Name",
      description: "Shopper first name (e.g. `Jane`).",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Shopper last name (e.g. `Doe`).",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Shopper email address (e.g. `jane.doe@example.com`).",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "ISO 3166 two-letter country code (e.g. `US`).",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "Shopper city.",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "Shopper state/province code.",
      optional: true,
    },
    zip: {
      type: "string",
      label: "ZIP",
      description: "Shopper ZIP/postal code.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Shopper phone number.",
      optional: true,
    },
    merchantShopperId: {
      type: "string",
      label: "Merchant Shopper ID",
      description: "Your own reference ID for this shopper, useful for later lookup.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bluesnap.createVaultedShopper({
      $,
      data: {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        country: this.country,
        city: this.city,
        state: this.state,
        zip: this.zip,
        phone: this.phone,
        merchantShopperId: this.merchantShopperId,
      },
    });

    $.export("$summary", `Created vaulted shopper ${response.vaultedShopperId}`);
    return response;
  },
};

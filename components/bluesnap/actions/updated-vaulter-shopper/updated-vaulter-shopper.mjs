// x-pd-ai: optimized
import bluesnap from "../../bluesnap.app.mjs";

export default {
  key: "bluesnap-update-vaulted-shopper",
  name: "Update Vaulted Shopper",
  description: "Update an existing vaulted shopper (PUT /services/2/vaulted-shoppers/{vaultedShopperId}). The vaultedShopperId is returned by **Create Vaulted Shopper** or a transaction response; BlueSnap does not expose a list-all-shoppers endpoint. [See the documentation](https://developers.bluesnap.com/v8976-JSON/reference/update-vaulted-shopper)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    bluesnap,
    vaultedShopperId: {
      propDefinition: [
        bluesnap,
        "vaultedShopperId",
      ],
      description: "The numeric vaulted shopper ID to update (e.g. `20769005`). Obtain it from the **Create Vaulted Shopper** response or a transaction record (BlueSnap has no list-shoppers endpoint).",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Updated shopper first name. Required if walletId is not sent.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Updated shopper last name. Required if walletId is not sent.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Updated shopper email address.",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Updated ISO 3166 two-letter country code (e.g. `US`).",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "Updated shopper city.",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "Updated shopper state/province code.",
      optional: true,
    },
    zip: {
      type: "string",
      label: "ZIP",
      description: "Updated shopper ZIP/postal code.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Updated shopper phone number.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bluesnap.updateVaultedShopper({
      $,
      vaultedShopperId: this.vaultedShopperId,
      data: {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        country: this.country,
        city: this.city,
        state: this.state,
        zip: this.zip,
        phone: this.phone,
      },
    });

    $.export("$summary", `Updated vaulted shopper ${this.vaultedShopperId}`);
    return response;
  },
};

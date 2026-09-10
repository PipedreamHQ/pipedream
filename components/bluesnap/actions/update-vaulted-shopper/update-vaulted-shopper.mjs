// x-pd-ai: optimized
import bluesnap from "../../bluesnap.app.mjs";

export default {
  key: "bluesnap-update-vaulted-shopper",
  name: "Update Vaulted Shopper",
  description: "Update an existing vaulted shopper. The vaultedShopperId is returned by **Create Vaulted Shopper** or a transaction response; BlueSnap does not expose a list-all-shoppers endpoint. [See the documentation](https://developers.bluesnap.com/v8976-JSON/reference/update-vaulted-shopper)",
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
      propDefinition: [
        bluesnap,
        "firstName",
      ],
      description: "Updated shopper first name. BlueSnap requires both name fields on update.",
      optional: false,
    },
    lastName: {
      propDefinition: [
        bluesnap,
        "lastName",
      ],
      description: "Updated shopper last name. BlueSnap requires both name fields on update.",
      optional: false,
    },
    email: {
      propDefinition: [
        bluesnap,
        "email",
      ],
      description: "Updated shopper email address.",
    },
    country: {
      propDefinition: [
        bluesnap,
        "country",
      ],
      description: "Updated ISO 3166 two-letter country code (e.g. `US`).",
    },
    city: {
      propDefinition: [
        bluesnap,
        "city",
      ],
      description: "Updated shopper city.",
    },
    state: {
      propDefinition: [
        bluesnap,
        "state",
      ],
      description: "Updated shopper state/province code.",
    },
    zip: {
      propDefinition: [
        bluesnap,
        "zip",
      ],
      description: "Updated shopper ZIP/postal code.",
    },
    phone: {
      propDefinition: [
        bluesnap,
        "phone",
      ],
      description: "Updated shopper phone number.",
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

// x-pd-ai: optimized
import bluesnap from "../../bluesnap.app.mjs";

export default {
  key: "bluesnap-create-vaulted-shopper",
  name: "Create Vaulted Shopper",
  description: "Create a vaulted shopper (stored customer) record in BlueSnap. Returns a vaultedShopperId usable in **Create Transaction**, **Get Vaulted Shopper**, and **Update Vaulted Shopper**. [See the documentation](https://developers.bluesnap.com/v8976-JSON/reference/create-vaulted-shopper)",
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
      propDefinition: [
        bluesnap,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        bluesnap,
        "lastName",
      ],
    },
    email: {
      propDefinition: [
        bluesnap,
        "email",
      ],
    },
    country: {
      propDefinition: [
        bluesnap,
        "country",
      ],
    },
    city: {
      propDefinition: [
        bluesnap,
        "city",
      ],
    },
    state: {
      propDefinition: [
        bluesnap,
        "state",
      ],
    },
    zip: {
      propDefinition: [
        bluesnap,
        "zip",
      ],
    },
    phone: {
      propDefinition: [
        bluesnap,
        "phone",
      ],
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

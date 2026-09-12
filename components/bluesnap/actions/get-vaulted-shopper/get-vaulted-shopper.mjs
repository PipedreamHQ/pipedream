// x-pd-ai: optimized
import bluesnap from "../../bluesnap.app.mjs";

export default {
  key: "bluesnap-get-vaulted-shopper",
  name: "Get Vaulted Shopper",
  description: "Retrieve a vaulted shopper (stored customer) by ID, including their billing contact details and stored payment sources. The vaultedShopperId is returned by **Create Vaulted Shopper** or found on a transaction record; BlueSnap does not expose a list-all-shoppers endpoint. [See the documentation](https://developers.bluesnap.com/v8976-JSON/reference/retrieve-vaulted-shopper)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
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
      description: "The numeric vaulted shopper ID to retrieve (e.g. `20769005`). Obtain it from the **Create Vaulted Shopper** response or a transaction record (BlueSnap has no list-shoppers endpoint).",
    },
  },
  async run({ $ }) {
    const response = await this.bluesnap.getVaultedShopper({
      $,
      vaultedShopperId: this.vaultedShopperId,
    });

    $.export("$summary", `Retrieved vaulted shopper ${this.vaultedShopperId}`);
    return response;
  },
};

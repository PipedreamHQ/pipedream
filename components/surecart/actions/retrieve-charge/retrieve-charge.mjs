import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-retrieve-charge",
  name: "Retrieve Charge",
  description: "Retrieve a single SureCart charge by its ID. Run **List Charges** first to obtain a valid charge ID. [See the documentation](https://developer.surecart.com/api-reference/charges/retrieve)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    surecart,
    chargeId: {
      type: "string",
      label: "Charge ID",
      description: "The ID of the charge to retrieve. Run **List Charges** first to obtain valid charge IDs. Example: `b47ca4c2-6cd2-41d5-aefb-4dc459642c56`.",
    },
  },
  async run({ $ }) {
    const response = await this.surecart.getCharge({
      $,
      chargeId: this.chargeId,
    });
    $.export("$summary", `Successfully retrieved charge ${this.chargeId}`);
    return response;
  },
};

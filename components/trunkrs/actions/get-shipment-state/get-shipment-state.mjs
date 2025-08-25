import trunkrs from "../../trunkrs.app.mjs";

export default {
  key: "trunkrs-get-shipment-state",
  name: "Get Shipment State",
  description: "Get the state of a shipment. [See the documentation](https://docs.trunkrs.nl/docs/v2-api-documentation/47b5b585da6c9-get-status-for-specific-shipment)",
  version: "0.0.1",
  type: "action",
  props: {
    trunkrs,
    trunkrsNr: {
      propDefinition: [
        trunkrs,
        "trunkrsNr",
      ],
    },
  },
  async run({ $ }) {
    const { data } = await this.trunkrs.getShipmentState({
      $,
      trunkrsNr: this.trunkrsNr,
    });
    $.export("$summary", `Successfully fetched shipment state for ${this.trunkrsNr}.`);
    return data;
  },
};

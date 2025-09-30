import trunkrs from "../../trunkrs.app.mjs";

export default {
  key: "trunkrs-cancel-shipment",
  name: "Cancel Shipment",
  description: "Cancel a shipment. [See the documentation](https://docs.trunkrs.nl/docs/v2-api-documentation/29cfeecfd2273-cancel-shipment)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    const { data } = await this.trunkrs.cancelShipment({
      $,
      trunkrsNr: this.trunkrsNr,
    });
    $.export("$summary", `Successfully cancelled shipment ${this.trunkrsNr}.`);
    return data;
  },
};

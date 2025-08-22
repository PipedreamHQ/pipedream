import trunkrs from "../../trunkrs.app.mjs";

export default {
  key: "trunkrs-get-shipment",
  name: "Get Shipment",
  description: "Get a shipment by its Trunkrs number. [See the documentation](https://docs.trunkrs.nl/docs/v2-api-documentation/34c6f57bded33-get-a-specific-shipment)",
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
    const { data } = await this.trunkrs.getShipment({
      $,
      trunkrsNr: this.trunkrsNr,
    });
    $.export("$summary", `Successfully fetched shipment ${this.trunkrsNr}.`);
    return data;
  },
};

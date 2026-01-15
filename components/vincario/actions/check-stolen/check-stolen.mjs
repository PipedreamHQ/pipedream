import vincario from "../../vincario.app.mjs";

export default {
  key: "vincario-check-stolen",
  name: "Check Stolen",
  description: "Performs a real-time VIN check in national police databases of stolen vehicles of Czech Republic, Hungary, Romania, Slovenia, Slovakia and Vincario's own database of stolen vehicles. [See the documentation](https://vincario.com/api-docs/3.2/#api-endpoints)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    vincario,
    vin: {
      propDefinition: [
        vincario,
        "vin",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.vincario.checkStolen({
      $,
      vin: this.vin,
    });
    $.export("$summary", `Successfully performed check for VIN: ${this.vin}`);
    return response;
  },
};

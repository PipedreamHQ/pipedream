import vincario from "../../vincario.app.mjs";

export default {
  key: "vincario-decode-vin",
  name: "Decode VIN",
  description: "Decode a VIN number. Returns an object with price, balance and array of vehicle specifications. [See the documentation](https://vincario.com/api-docs/3.2/#api-endpoints)",
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
    const response = await this.vincario.decodeVin({
      $,
      vin: this.vin,
    });
    $.export("$summary", `Successfully decoded VIN: ${this.vin}`);
    return response;
  },
};

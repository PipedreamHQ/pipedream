import vincario from "../../vincario.app.mjs";

export default {
  key: "vincario-get-vin-decoder-info",
  name: "Get VIN Decoder Info",
  description: "Get a list of vehicle attributes. Each represents label that is available for given VIN when you do a 'VIN Decode' request. [See the documentation](https://vincario.com/api-docs/3.2/#api-endpoints)",
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
    const response = await this.vincario.getVinDecoderInfo({
      $,
      vin: this.vin,
    });
    $.export("$summary", `Successfully retrieved VIN decoder info for VIN: ${this.vin}`);
    return response;
  },
};

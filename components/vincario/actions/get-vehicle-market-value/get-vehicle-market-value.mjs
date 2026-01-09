import vincario from "../../vincario.app.mjs";

export default {
  key: "vincario-get-vehicle-market-value",
  name: "Get Vehicle Market Value",
  description: "Get the market value of a vehicle. [See the documentation](https://vincario.com/api-docs/3.2/#api-endpoints)",
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
    odometer: {
      type: "integer",
      label: "Odometer",
      description: "The odometer reading of the vehicle",
      optional: true,
    },
    odometerUnit: {
      type: "string",
      label: "Odometer Unit",
      description: "The unit of the odometer reading. Defaults to 'km' if not provided",
      optional: true,
      options: [
        "km",
        "mi",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.vincario.getVehicleMarketValue({
      $,
      vin: this.vin,
      params: {
        odometer: this.odometer,
        odometerUnit: this.odometerUnit,
      },
    });
    $.export("$summary", `Successfully retrieved market value for VIN: ${this.vin}`);
    return response;
  },
};

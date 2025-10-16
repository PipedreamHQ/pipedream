import gryd from "../../gryd.app.mjs";

export default {
  key: "gryd-get-vehicle-data",
  name: "Get Vehicle Data",
  description: "Fetches data for a specific vehicle from the Gryd API. [See the documentation](https://api.gryd.org/docs#/default/VehicleController_vehicleByVRM)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    gryd,
    vehicleId: {
      propDefinition: [
        gryd,
        "vehicleId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.gryd.getVehicleData(this.vehicleId);

    if (response) {
      $.export("$summary", "Successfully retrieved vehicle data.");
    }

    return response;
  },
};

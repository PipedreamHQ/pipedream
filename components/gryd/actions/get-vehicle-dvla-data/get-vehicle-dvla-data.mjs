import gryd from "../../gryd.app.mjs";

export default {
  key: "gryd-get-vehicle-dvla-data",
  name: "Get Vehicle DVLA Data",
  description: "Fetches DVLA data for a specific vehicle from the Gryd API. [See the documentation](https://api.gryd.org/docs#/default/VehicleController_dvlaByVRM)",
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
    const response = await this.gryd.getVehicleDVLA(this.vehicleId);

    if (response) {
      $.export("$summary", "Successfully retrieved DVLA vehicle data.");
    }

    return response;
  },
};

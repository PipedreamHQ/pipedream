import gryd from "../../gryd.app.mjs";

export default {
  key: "gryd-get-vehicle-mot-data",
  name: "Get Vehicle MOT Data",
  description: "Fetches MOT data for a specific vehicle from the Gryd API. [See the documentation](https://api.gryd.org/docs#/default/VehicleController_motByVRM)",
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
    const response = await this.gryd.getVehicleMOT(this.vehicleId);

    if (response) {
      $.export("$summary", "Successfully retrieved MOT vehicle data.");
    }

    return response;
  },
};

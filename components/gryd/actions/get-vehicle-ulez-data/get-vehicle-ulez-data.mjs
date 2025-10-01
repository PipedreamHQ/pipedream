import gryd from "../../gryd.app.mjs";

export default {
  key: "gryd-get-vehicle-ulez-data",
  name: "Get Vehicle ULEZ Data",
  description: "Fetches ULEZ data for a specific vehicle from the Gryd API. [See the documentation](https://api.gryd.org/docs#/default/VehicleController_ulezByVRM)",
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
    const response = await this.gryd.getVehicleULEZ(this.vehicleId);

    if (response) {
      $.export("$summary", "Successfully retrieved ULEZ vehicle data.");
    }

    return response;
  },
};

import digitalOceanApp from "../../digital_ocean.app.mjs";
import digitalOceanConstants from "../../common/constants.mjs";

export default {
  key: "digital_ocean-turnonoff-droplet",
  name: "Turn on/off Droplet",
  description: "Turns a droplet on or off",
  version: "0.1.2",
  type: "action",
  props: {
    digitalOceanApp,
    turn_onoff: {
      label: "Power status",
      type: "string",
      description: "Must be `power_on` to turn on, or `power_off` to turn off.",
      options: digitalOceanConstants.powerOptions,
    },
    droplet_id: {
      label: "Droplet",
      type: "string",
      description: "The unique identifier of Droplet to snapshot.",
      async options() {
        return this.digitalOceanApp.fetchDropletOps();
      },
    },
  },
  async run({ $ }) {
    const api = this.digitalOceanApp.digitalOceanWrapper();
    const powerOnOffData = {
      type: this.turn_onoff,
    };
    const response = await api.droplets.requestAction(this.droplet_id, powerOnOffData);
    $.export("$summary", `Successfully enqueued action to ${response.action.type}.`);
    return response;
  },
};

import digitalOceanApp from "../../digital_ocean.app.mjs";
import options from "../../common/options.mjs";

export default {
  key: "digital_ocean-turnonoff-droplet",
  name: "Turn on/off Droplet",
  description: "Turns a droplet on or off",
  version: "0.1.2",
  type: "action",
  props: {
    digitalOceanApp: digitalOceanApp,
    turn_onoff: {
      label: "Power status",
      type: "string",
      description: "Must be `power_on` to turn on, or `power_off` to turn off.",
      options: options.powerOptions,
    },
    droplet_id: {
      label: "Droplet",
      type: "string",
      description: "The unique identifier of Droplet to snapshot.",
      async options() {
        return await this.digitalOceanApp.fetchDropletOps();
      },
    },
  },
  async run({ $ }) {
    const api = this.digitalOceanApp.digitalOceanWrapper();
    var powerOnOffData = {
      type: this.turn_onoff,
    };
    $.export("dropletId", this.droplet_id);
    $.export("powerOnOffData", powerOnOffData);
    return await api.droplets.requestAction(this.droplet_id, powerOnOffData);
  },
};

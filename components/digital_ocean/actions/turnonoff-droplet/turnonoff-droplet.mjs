import digitalOceanApp from "../../digital_ocean.app.mjs";
import digitalOceanConstants from "../../common/constants.mjs";

export default {
  key: "digital_ocean-turnonoff-droplet",
  name: "Turn on/off Droplet",
  description: "Turns a droplet power status either on or off. [See the docs here](https://docs.digitalocean.com/reference/api/api-reference/#operation/post_droplet_action)",
  version: "0.1.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    digitalOceanApp,
    turnOnOff: {
      label: "Power status",
      type: "string",
      description: "Must be `power_on` to turn on, or `power_off` to turn off.",
      options: digitalOceanConstants.powerOptions,
    },
    dropletId: {
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
      type: this.turnOnOff,
    };
    const response = await api.droplets.requestAction(this.dropletId, powerOnOffData);
    $.export("$summary", `Successfully enqueued action to ${response.action.type}.`);
    return response;
  },
};

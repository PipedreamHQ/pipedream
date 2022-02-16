// legacy_hash_id: a_67ij1A
import doWrapperModule from "do-wrapper";

export default {
  key: "digital_ocean-turnonoff-droplet",
  name: "Turn on/off Droplet",
  description: "Turns a droplet on or off",
  version: "0.1.1",
  type: "action",
  props: {
    digital_ocean: {
      type: "app",
      app: "digital_ocean",
    },
    page_size: {
      type: "integer",
      optional: true,
    },
    turn_onoff: {
      type: "string",
      description: "Must be \"power_on\" to turn on, or \"power_off\" to turn off.",
      options: [
        "power_off",
        "power_on",
      ],
    },
    droplet_id: {
      type: "integer",
      description: "The unique identifier of Droplet to turn on/off.",
    },
  },
  async run({ $ }) {
    var DigitalOcean = doWrapperModule.default,
      api = new DigitalOcean(this.digital_ocean.$auth.oauth_access_token, this.page_size);

    try {
      var action = {
        "type": this.turn_onoff,
      };
      $.export("resp", await api.dropletsRequestAction(  this.droplet_id, action ));
    } catch (err) {
      $.export("err", err);

    }
  },
};

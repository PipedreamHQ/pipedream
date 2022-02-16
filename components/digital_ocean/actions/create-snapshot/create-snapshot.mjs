// legacy_hash_id: a_0Mi864
import doWrapperModule from "do-wrapper";

export default {
  key: "digital_ocean-create-snapshot",
  name: "Create Snapshot",
  description: "Creates an snapshot from a droplet",
  version: "0.2.1",
  type: "action",
  props: {
    digital_ocean: {
      type: "app",
      app: "digital_ocean",
    },
    page_size: {
      type: "integer",
      description: "Desired pagination size when pulling results",
      optional: true,
    },
    snapshot_name: {
      type: "string",
      description: "The name to give the new snapshot",
      optional: true,
    },
    droplet_id: {
      type: "integer",
      description: "The unique identifier of Droplet to snapshot.",
    },
  },
  async run({ $ }) {
    var DigitalOcean = doWrapperModule.default,
      api = new DigitalOcean(this.digital_ocean.$auth.oauth_access_token, this.page_size);

    try {
      var action = {
        "type": "snapshot",
        "name": this.snapshot_name,
      };
      $.export("resp", await api.dropletsRequestAction(  this.droplet_id, action ));
    } catch (err) {
      $.export("err", err);

    }
  },
};

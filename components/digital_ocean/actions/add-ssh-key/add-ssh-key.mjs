// legacy_hash_id: a_8KiVPz
import doWrapperModule from "do-wrapper";

export default {
  key: "digital_ocean-add-ssh-key",
  name: "Add SSH Key",
  description: "Adds a new SSH to your account.",
  version: "0.1.1",
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
    name: {
      type: "string",
      description: "The name to give the new SSH key in your account.",
    },
    public_key: {
      type: "string",
      description: "A string containing the entire public key.",
    },
  },
  async run({ $ }) {
    var DigitalOcean = doWrapperModule.default,
      api = new DigitalOcean(this.digital_ocean.$auth.oauth_access_token, this.page_size);

    try {
      var configuration = {
        "name": this.name,
        "public_key": this.public_key,
      };

      $.export("resp", await api.accountAddKey(  configuration ));
    } catch (err) {
      $.export("err", err);

    }
  },
};

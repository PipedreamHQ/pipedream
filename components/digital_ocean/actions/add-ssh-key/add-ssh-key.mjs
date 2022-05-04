import digitalOceanApp from "../../digital_ocean.app.mjs";

export default {
  key: "digital_ocean-add-ssh-key",
  name: "Add SSH Key",
  description: "Adds a new SSH to your account.",
  version: "0.1.2",
  type: "action",
  props: {
    digitalOceanApp: digitalOceanApp,
    name: {
      label: "Name",
      type: "string",
      description: "A human-readable display name for this key, used to easily identify the SSH keys when they are displayed.",
    },
    public_key: {
      label: "Public key",
      type: "string",
      description: "The entire public key string. Embedded into the root user's authorized_keys file if you include this key during Droplet creation.",
    },
  },
  async run({ $ }) {
    const api = this.digitalOceanApp.digitalOceanWrapper();
    var newKeyData = {
      name: this.name,
      public_key: this.public_key,
    };
    $.export("newKeyData", newKeyData);
    return await api.keys.add(newKeyData);
  },
};

import digitalOceanApp from "../../digital_ocean.app.mjs";

export default {
  key: "digital_ocean-add-ssh-key",
  name: "Add SSH Key",
  description: "Adds a new SSH to your account. [See the docs here](https://docs.digitalocean.com/reference/api/api-reference/#operation/create_ssh_key)",
  version: "0.1.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    digitalOceanApp,
    name: {
      label: "Name",
      type: "string",
      description: "A human-readable display name for this key, used to easily identify the SSH keys when they are displayed.",
    },
    publicKey: {
      label: "Public key",
      type: "string",
      description: "The entire public key string. Embedded into the root user's authorized_keys file if you include this key during Droplet creation.",
    },
  },
  async run({ $ }) {
    const api = this.digitalOceanApp.digitalOceanWrapper();
    const newKeyData = {
      name: this.name,
      public_key: this.publicKey,
    };
    const response = await api.keys.add(newKeyData);
    $.export("$summary", `Successfully added ssh key ${response.ssh_key.fingerprint}.`);
    return response;
  },
};

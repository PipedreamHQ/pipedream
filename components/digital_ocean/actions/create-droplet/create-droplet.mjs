// legacy_hash_id: a_Xzi2O8
import doWrapperModule from "do-wrapper";

export default {
  key: "digital_ocean-create-droplet",
  name: "Create Droplet",
  description: "Creates a droplet",
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
      description: "Human-readable string to use when displaying the Droplet name.",
    },
    region: {
      type: "string",
      description: "Unique slug identifier for the region to deploy this Droplet in.",
    },
    size: {
      type: "string",
      description: "Unique slug identifier for the size to select for this Droplet.",
    },
    image: {
      type: "string",
      description: "The image ID of a public or private image, or the unique slug identifier for a public image. This image will be the base image for this Droplet.",
    },
    ssh_keys: {
      type: "any",
      description: "An array containing the IDs or fingerprints of the SSH keys that you wish to embed in the Droplet's root account upon creation.",
      optional: true,
    },
    backups: {
      type: "boolean",
      description: "A boolean indicating whether automated backups should be enabled for the Droplet. Automated backups can only be enabled when the Droplet is created.",
      optional: true,
    },
    ipv6: {
      type: "boolean",
      description: "A boolean indicating whether IPv6 is enabled on the Droplet.",
      optional: true,
    },
    user_data: {
      type: "string",
      description: "A string containing 'user data' which may be used to configure the Droplet on first boot, often a 'cloud-config' file or Bash script. It must be plain text and may not exceed 64 KiB in size.",
      optional: true,
    },
    private_networking: {
      type: "boolean",
      description: "A boolean indicating whether private networking is enabled for the Droplet. Private networking is currently only available in certain regions.",
      optional: true,
    },
    volumes: {
      type: "any",
      description: "A flat array including the unique string identifier for each Block Storage volume to be attached to the Droplet. At the moment a volume can only be attached to a single Droplet.",
      optional: true,
    },
    tags: {
      type: "any",
      description: "A flat array of tag names as strings to apply to the Droplet after it is created. Tag names can either be existing or new tags.",
      optional: true,
    },
    monitoring: {
      type: "boolean",
      description: "A boolean indicating whether to install the DigitalOcean agent for monitoring.",
      optional: true,
    },
  },
  async run({ $ }) {
    var DigitalOcean = doWrapperModule.default,
      api = new DigitalOcean(this.digital_ocean.$auth.oauth_access_token, this.page_size);

    try {
      var data = {
        name: this.name,
        region: this.region,
        size: this.size,
        image: this.image,
        ssh_keys: this.ssh_keys,
        backups: this.backups,
        ipv6: this.ipv6,
        user_data: this.user_data,
        private_networking: this.private_networking,
        volumes: this.volumes,
        tags: this.tags,
        monitoring: this.monitoring,
      };
      $.export("resp", await api.dropletsCreate(data));
    } catch (err) {
      $.export("err", err);

    }
  },
};

import digitalOceanApp from "../../digital_ocean.app.mjs";

export default {
  key: "digital_ocean-create-droplet",
  name: "Create Droplet",
  description: "Creates a droplet. [See the docs here](https://docs.digitalocean.com/reference/api/api-reference/#operation/create_droplet)",
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
      description: "Human-readable string to use when displaying the Droplet name.",
    },
    region: {
      label: "Region",
      type: "string",
      description: "Unique slug identifier for the region to deploy this Droplet in.",
      reloadProps: true,
      async options() {
        return this.digitalOceanApp.fetchRegionsOpts();
      },
    },
  },
  async additionalProps() {
    if (!this.region) {
      return {};
    }
    return {
      image: {
        label: "Image",
        type: "string",
        description: "The image ID of a public or private image, or the unique slug identifier for a public image. This image will be the base image for this Droplet.",
        reloadProps: false,
        options: async () => {
          return this.digitalOceanApp.fetchImageOpts(this.region);
        },
      },
      size: {
        label: "Size",
        type: "string",
        description: "Unique slug identifier for the size to select for this Droplet.",
        reloadProps: false,
        options: async () => {
          return this.digitalOceanApp.fetchSizeOpts(this.region);
        },
      },
      volumes: {
        label: "Volumes",
        type: "string[]",
        description: "A flat array including the unique string identifier for each Block Storage volume to be attached to the Droplet. At the moment a volume can only be attached to a single Droplet.",
        optional: true,
        reloadProps: false,
        options: async () => {
          return this.digitalOceanApp.fetchVolumeOpts(this.region);
        },
      },
      sshKeys: {
        label: "SSH keys",
        type: "string[]",
        description: "An array containing the IDs or fingerprints of the SSH keys that you wish to embed in the Droplet's root account upon creation.",
        optional: true,
        reloadProps: false,
        options: async () => {
          return this.digitalOceanApp.fetchSshKeys();
        },
      },
      backups: {
        label: "Enable Automated Backup",
        type: "boolean",
        description: "A boolean indicating whether automated backups should be enabled for the Droplet. Automated backups can only be enabled when the Droplet is created.",
        optional: true,
      },
      ipv6: {
        label: "Enable IPv6",
        type: "boolean",
        description: "A boolean indicating whether IPv6 is enabled on the Droplet.",
        optional: true,
      },
      userData: {
        label: "User Data",
        type: "string",
        description: "A string containing 'user data' which may be used to configure the Droplet on first boot, often a 'cloud-config' file or Bash script. It must be plain text and may not exceed 64 KiB in size.",
        optional: true,
      },
      privateNetworking: {
        label: "Enable Private Networking",
        type: "boolean",
        description: "A boolean indicating whether private networking is enabled for the Droplet. Private networking is currently only available in certain regions.",
        optional: true,
      },
      monitoring: {
        label: "Enable Monitoring",
        type: "boolean",
        description: "A boolean indicating whether to install the DigitalOcean agent for monitoring.",
        optional: true,
      },
      tags: {
        label: "Tags",
        type: "string[]",
        description: "A flat array of tag names as strings to apply to the Droplet after it is created. Tag names can either be existing or new tags.",
        optional: true,
      },
    };
  },
  async run({ $ }) {
    const api = this.digitalOceanApp.digitalOceanWrapper();
    const newDropletData = {
      name: this.name,
      region: this.region,
      size: this.size,
      image: this.image,
      ssh_keys: this.sshKeys,
      backups: this.backups,
      ipv6: this.ipv6,
      user_data: this.userData,
      private_networking: this.privateNetworking,
      volumes: this.volumes,
      tags: this.tags,
      monitoring: this.monitoring,
    };
    const response = await api.droplets.create(newDropletData);
    $.export("$summary", `Successfully created droplet ${response.droplet.name}.`);
    return response;
  },
};

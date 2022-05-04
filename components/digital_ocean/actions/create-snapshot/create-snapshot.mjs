import digitalOceanApp from "../../digital_ocean.app.mjs";

export default {
  key: "digital_ocean-create-snapshot",
  name: "Create Snapshot",
  description: "Creates an snapshot from a droplet",
  version: "0.2.2",
  type: "action",
  props: {
    digitalOceanApp: digitalOceanApp,
    snapshot_name: {
      label: "Snapshot name",
      type: "string",
      description: "The name to give the new snapshot",
      optional: true,
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
    var newSnapshotData = {
      type: "snapshot",
      name: this.snapshot_name,
    };
    $.export("dropletId", this.droplet_id);
    $.export("newSnapshotData", newSnapshotData);
    return await api.droplets.requestAction(this.droplet_id, newSnapshotData);
  },
};

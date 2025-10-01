import digitalOceanApp from "../../digital_ocean.app.mjs";

export default {
  key: "digital_ocean-create-snapshot",
  name: "Create Snapshot",
  description: "Creates a snapshot from a droplet. [See the docs here](https://docs.digitalocean.com/reference/api/api-reference/#operation/post_droplet_action)",
  version: "0.2.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    digitalOceanApp,
    snapshotName: {
      label: "Snapshot name",
      type: "string",
      description: "The name to give the new snapshot",
      optional: true,
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
    const newSnapshotData = {
      type: "snapshot",
      name: this.snapshotName,
    };
    const response = await api.droplets.requestAction(this.dropletId, newSnapshotData);
    $.export("$summary", `Successfully enqueued action to ${response.action.type}.`);
    return response;
  },
};

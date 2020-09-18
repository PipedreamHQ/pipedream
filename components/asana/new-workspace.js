const asana = require("https://github.com/PipedreamHQ/pipedream/components/asana/asana.app.js");

module.exports = {
  name: "Workspace Added",
  description: "Emits an event each time you add a new workspace/organization.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    asana,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },

  async run(event) {
    let results = await this.asana.getWorkspaces();
    for (const result of results) {
      let workspace = await this.asana.getWorkspace(result.gid);
      this.$emit(workspace, {
        id: workspace.gid,
        summary: workspace.name,
        ts: Date.now(),
      });
    }
  },
};
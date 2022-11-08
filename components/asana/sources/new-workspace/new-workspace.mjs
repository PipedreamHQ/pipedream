import asana from "../../asana.app.mjs";

export default {
  type: "source",
  key: "asana-new-workspace",
  name: "New Workspace Added",
  description: "Emit new event each time you add a new workspace/organization.",
  version: "0.1.1",
  dedupe: "unique",
  props: {
    asana,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
  },

  async run() {
    const workspaces = await this.asana.getWorkspaces();

    for (let workspace of workspaces) {
      workspace = await this.asana.getWorkspace(workspace.gid);

      this.$emit(workspace, {
        id: workspace.gid,
        summary: workspace.name,
        ts: Date.now(),
      });
    }
  },
};

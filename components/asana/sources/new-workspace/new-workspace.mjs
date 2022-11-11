import asana from "../../asana.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  type: "source",
  key: "asana-new-workspace",
  name: "New Workspace Added",
  description: "Emit new event each time you add a new workspace/organization.",
  version: "0.1.2",
  dedupe: "unique",
  props: {
    asana,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
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

import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import asana from "../../asana.app.mjs";

export default {
  type: "source",
  key: "asana-new-workspace",
  name: "New Workspace Added",
  description: "Emit new event each time you add a new workspace/organization.",
  version: "0.1.12",
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
    const { data: workspaces } = await this.asana.getWorkspaces();

    for (const item of workspaces) {
      const { data: workspace } = await this.asana.getWorkspace({
        workspaceId: item.gid,
      });

      this.$emit(workspace, {
        id: workspace.gid,
        summary: workspace.name,
        ts: Date.now(),
      });
    }
  },
};

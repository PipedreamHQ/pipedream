import app from "../../phantombuster.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "phantombuster-new-output",
  name: "New Output Created Event",
  description: "Emit new events when new outputs are created. [See the docs here](https://hub.phantombuster.com/reference/get_agents-fetch-output-1)",
  version: "0.0.1",
  type: "source",
  props: {
    app,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    db: "$.service.db",
    agentId: {
      propDefinition: [
        app,
        "agentId",
      ],
    },
  },
  methods: {
    setLastUpdated(lastUpdated) {
      this.db.set("lastUpdated", lastUpdated);
    },
    getLastUpdated() {
      return this.db.get("lastUpdated") || 0;
    },
    setLastContainerId(lastContainerId) {
      this.db.set("lastContainerId", lastContainerId);
    },
    getLastContainerId() {
      return this.db.get("lastContainerId") || 0;
    },
  },
  async run() {
    const resp = await this.app.getOutput({ //always there is one last output for an agent
      params: {
        id: this.agentId,
      },
    });
    if (this.getLastContainerId() != resp.containerId ||
      (resp.mostRecentEndedAt && this.getLastUpdated() < resp.mostRecentEndedAt)) {
      this.$emit(
        resp,
        {
          id: resp.mostRecentEndedAt || Date.now(),
          summary: resp.output,
          ts: resp.mostRecentEndedAt || Date.now(),
        },
      );
      this.setLastUpdated(resp.mostRecentEndedAt);
      this.setLastContainerId(resp.containerId);
    }
  },
};

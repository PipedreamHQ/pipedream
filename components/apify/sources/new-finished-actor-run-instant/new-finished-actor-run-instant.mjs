import apify from "../../apify.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "apify-new-finished-actor-run-instant",
  name: "New Finished Actor Run",
  description: "Emits a new event when a selected actor is run and finishes. [See the documentation](https://docs.apify.com/api/v2)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    apify,
    db: "$.service.db",
    actorId: {
      propDefinition: [
        apify,
        "actorId",
      ],
    },
    runStatus: {
      propDefinition: [
        apify,
        "runStatus",
        (c) => ({
          actorId: c.actorId,
        }),
      ],
      optional: true,
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60, // Poll every minute
      },
    },
  },
  hooks: {
    async deploy() {
      // Fetch last run details to set up initial state
      const { data } = await this.apify._makeRequest({
        path: `/actors/${this.actorId}/runs?desc=true&limit=1`,
      });
      if (data && data.length) {
        this.db.set("lastRunId", data[0].id);
      }
    },
  },
  methods: {
    async fetchActorRuns() {
      const lastRunId = this.db.get("lastRunId");
      const { data: runs } = await this.apify._makeRequest({
        path: `/actors/${this.actorId}/runs?desc=true&limit=5`,
      });

      const newRuns = runs.filter((run) => run.id !== lastRunId);
      if (this.runStatus) {
        return newRuns.filter((run) => run.status === this.runStatus);
      }
      return newRuns;
    },
    generateMeta(data) {
      const {
        id, startedAt, status,
      } = data;
      return {
        id,
        summary: `Actor run ${id} has finished with status: ${status}`,
        ts: Date.parse(startedAt),
      };
    },
  },
  async run() {
    const newRuns = await this.fetchActorRuns();
    if (newRuns.length) {
      newRuns.forEach((run) => {
        this.$emit(run, this.generateMeta(run));
      });
      this.db.set("lastRunId", newRuns[0].id); // Assuming the first one is the latest
    }
  },
};

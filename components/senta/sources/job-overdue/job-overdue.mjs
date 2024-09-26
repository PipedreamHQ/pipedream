import senta from "../../senta.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "senta-job-overdue",
  name: "New Job Overdue",
  description: "Emit new event when a job becomes overdue.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    senta,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    clientViewId: {
      propDefinition: [
        senta,
        "clientViewId",
      ],
    },
    clientId: {
      propDefinition: [
        senta,
        "clientId",
        (c) => ({
          clientViewId: c.clientViewId,
        }),
      ],
    },
  },
  methods: {
    generateMeta(job) {
      return {
        id: job._id,
        summary: job.title,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const { docs } = await this.senta.listJobs({
      params: {
        cid: this.clientId,
        status: "overdue",
      },
    });
    for (const doc of docs) {
      const meta = this.generateMeta(doc);
      this.$emit(doc, meta);
    }
  },
};

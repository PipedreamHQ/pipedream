import oxylabs from "../../oxylabs.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import sampleEmit from "./test-event.mjs";

export default {
  key: "oxylabs-new-scheduled-run-completed",
  name: "New Scheduled Run Completed",
  description: "Emit new event when a new scheduled run is completed. [See the documentation](https://developers.oxylabs.io/scraping-solutions/web-scraper-api/features/scheduler#get-runs-information)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    oxylabs,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    scheduleId: {
      propDefinition: [
        oxylabs,
        "scheduleId",
      ],
    },
  },
  methods: {
    generateMeta(run) {
      return {
        id: run.id,
        summary: `New Run with ID: ${run.id}`,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const { runs } = await this.oxylabs.getRunsInfo({
      scheduleId: this.scheduleId,
    });
    for (const run of runs) {
      const meta = this.generateMeta(run);
      this.$emit(run, meta);
    }
  },
  sampleEmit,
};

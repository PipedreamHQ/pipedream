import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import browserhub from "../../browserhub.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "browserhub-new-finished-automation-run",
  name: "New Finished Automation Run",
  description: "Emit new event when an automation run has finished running. [See the documentation](https://developer.browserhub.io/)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    browserhub,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the AskNicely on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    scraperId: {
      propDefinition: [
        browserhub,
        "scraperId",
      ],
      optional: true,
    },
  },
  methods: {
    _getBaseDate() {
      return this.db.get("baseDate");
    },
    _setBaseDate(baseDate = null) {
      this.db.set("baseDate", baseDate);
    },
    async startEvent(maxResults = 0) {
      const baseDate = this._getBaseDate();
      let newBaseDate = null;

      const response = this.browserhub.paginate({
        fn: this.browserhub.listRuns,
        maxResults,
        baseDate,
        params: {
          scraper_id: this.scraperId,
        },
      });

      const responseArray = [];

      for await (const item of response) {
        if (item.status === "successful") responseArray.push(item);
        if (item.status === "running") newBaseDate = item.created_at;
      }

      if (newBaseDate) this._setBaseDate(newBaseDate);
      if (!newBaseDate && responseArray.length) this._setBaseDate(responseArray[0].created_at);

      for (const item of responseArray.reverse()) {
        this.$emit(
          item,
          {
            id: item.id,
            summary: `Successfully finished automation run with ID: ${item.id}`,
            ts: item.created_at,
          },
        );
      }
    },
  },
  hooks: {
    async deploy() {
      await this.startEvent(25);
    },
  },
  async run() {
    await this.startEvent();
  },
  sampleEmit,
};

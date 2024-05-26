import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import greenhouse from "../../greenhouse.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "greenhouse-new-candidate-application",
  name: "New Candidate Application",
  description: "Emit new event when a candidate submits a new application.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    greenhouse,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || "1970-01-01";
    },
    _setLastDate(created) {
      this.db.set("lastDate", created);
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: `New candidate application with Id: ${item.id}`,
        ts: new Date(),
      };
    },
    async startEvent(maxResults) {
      const lastDate = this._getLastDate();
      const response = this.greenhouse.paginate({
        fn: this.greenhouse.listApplications,
        params: {
          created_after: lastDate,
        },
      });

      let responseArray = [];
      for await (const item of response) {
        responseArray.push(item);
      }

      responseArray = responseArray.reverse();

      if (responseArray.length) {
        if (responseArray.length > maxResults) {
          responseArray.length = maxResults;
        }
        this._setLastDate(responseArray[0].applied_at);
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, this.generateMeta(item));
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

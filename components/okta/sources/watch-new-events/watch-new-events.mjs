import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import okta from "../../okta.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "okta-watch-new-events",
  name: "New Okta Event",
  description: "Emit new event when the system observes a new event.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    okta,
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
      return this.db.get("lastDate") || "1970-01-01T00:00:00Z";
    },
    _setLastDate(created) {
      this.db.set("lastDate", created);
    },
    generateMeta(event) {
      return {
        id: event.uuid,
        summary: `New Okta Event: ${event.eventType}`,
        ts: Date.parse(event.published),
      };
    },
    async startEvent(maxResults = 0) {
      const lastDate = this._getLastDate();
      const response = this.okta.paginate({
        fn: this.okta.listLogs,
        maxResults,
        params: {
          since: lastDate,
          sortOrder: "DESCENDING",
        },
      });

      let responseArray = [];

      for await (const item of response) {
        responseArray.push(item);
      }

      if (responseArray.length) this._setLastDate(responseArray[0].published);

      for (const event of responseArray.reverse()) {
        this.$emit(event, this.generateMeta(event));
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

import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import asknicely from "../../asknicely.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "asknicely-survey-response-received",
  name: "New Survey Response Received",
  version: "0.0.2",
  description: "Emit new event when a survey is responded.",
  type: "source",
  dedupe: "unique",
  props: {
    asknicely,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the AskNicely on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || 0;
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async startEvent(maxResults = 0) {
      const { asknicely } = this;

      const lastDate = this._getLastDate();
      const items = asknicely.paginate({
        fn: asknicely.getResponses,
        sort: "desc",
        sinceTime: lastDate,
        maxResults,
      });

      let responseArray = [];

      for await (const item of items) {
        responseArray.push(item);
      }
      if (responseArray.length) this._setLastDate(responseArray[0].responded);

      for (const item of responseArray.reverse()) {
        this.$emit(
          item,
          {
            id: item.response_id,
            summary: `A new response with id: "${item.response_id}" was received!`,
            ts: item.responded,
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

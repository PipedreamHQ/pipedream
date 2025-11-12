import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import convenia from "../../convenia.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "convenia-new-vacation-request",
  name: "New Vacation Request",
  description: "Emit new event when there is a new vacation request at the company.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    convenia,
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
      return this.db.get("lastDate") || 0;
    },
    _setLastDate(id) {
      this.db.set("lastDate", id);
    },
    async startEvent(maxResults = false) {
      const lastDate = this._getLastDate();
      let count = 0;
      let responseArray = [];
      let items = this.convenia.paginate({
        fn: this.convenia.listVacations,
      });

      for await (const item of items) {
        responseArray.push(item);
      }

      responseArray = responseArray
        .filter((item) => Date.parse(item.created_at) >= lastDate)
        .sort((a, b) => Date.parse(a.created_at) - Date.parse(b.created_at));

      for (const vacation of responseArray) {
        if (maxResults && (++count >= maxResults)) break;

        this.$emit(vacation, {
          id: vacation.id,
          summary: `New vacation request with ID: ${vacation.id}`,
          ts: Date.parse(vacation.created_at),
        });
      }

      if (responseArray.length > 0) {
        this._setLastDate(Date.parse(responseArray[responseArray.length - 1].created_at));
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

import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import { LIMIT } from "../../common/constants.mjs";
import icypeas from "../../icypeas.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "icypeas-new-single-result",
  name: "New Single Search Result",
  description: "Emit new event when a single search result comes in.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    icypeas,
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
      return this.db.get("lastDate") || "1970-01-01T00:00:00.001Z";
    },
    _setLastDate(created) {
      this.db.set("lastDate", created);
    },
    generateMeta(item) {
      return {
        id: item._id,
        summary: `New result with Id: ${item._id}`,
        ts: item.system.createdAt,
      };
    },
    async startEvent(maxResults = 0) {
      const lastDate = this._getLastDate();

      const data = this.icypeas.paginate({
        fn: this.icypeas.retrieveSingleSearchResult,
        maxResults,
        data: {
          next: true,
          limit: LIMIT,
        },
      });

      const responseArray = [];
      for await (const item of data) {
        if (Date.parse(item.system.createdAt) <= Date.parse(lastDate)) break;
        responseArray.push(item);
      }

      if (responseArray.length) this._setLastDate(responseArray[0].system.createdAt);

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

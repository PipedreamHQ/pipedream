import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import shift4 from "../../shift4.app.mjs";

export default {
  props: {
    shift4,
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
    _setLastDate(created) {
      this.db.set("lastDate", created);
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: this.getSummary(item),
        ts: item.created,
      };
    },
    async startEvent(maxResults = 0) {
      const lastDate = this._getLastDate();

      const data = this.shift4.paginate({
        fn: this.shift4.listEvents,
        maxResults,
        params: {
          created: {
            gt: lastDate,
          },
        },
        filterTypes: this.getFilterTypes(),
      });

      const responseArray = [];
      for await (const item of data) {
        responseArray.push(item);
      }

      if (responseArray.length) this._setLastDate(responseArray[0].created);

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
};

import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import frontapp from "../../frontapp.app.mjs";

export default {
  props: {
    frontapp,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") ?? 1000000000;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    async startEvent(maxResults = 0) {
      const lastTs = this._getLastTs();
      const items = this.frontapp.paginate({
        fn: this._getFunction(),
        params: this._getParams(lastTs),
        maxResults,
      });

      let responseArray = [];

      for await (const item of items) {
        responseArray.push(item);
      }

      if (responseArray.length) this._setLastTs(responseArray[0].emitted_at);

      for (const item of responseArray.reverse()) {
        this.$emit(
          item,
          this._getEmit(item),
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
};

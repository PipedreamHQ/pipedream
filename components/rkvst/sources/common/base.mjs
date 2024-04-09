import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import rkvst from "../../rkvst.app.mjs";

export default {
  props: {
    rkvst,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastDatetime() {
      return this.db.get("lastDatetime") || 0;
    },
    _setLastDatetime(lastDatetime = null) {
      this.db.set("lastDatetime", lastDatetime);
    },
    generateMeta(event) {
      return {
        id: event.identity,
        summary: this.getSummary(event),
        ts: Date.parse(event.at_time),
      };
    },
    async startEvent(maxResults = null) {
      const lastDatetime = this._getLastDatetime();

      const response = this.rkvst.paginate(this.getParams());
      let events = [];

      for await (const item of response) {
        events.push(item);
      }

      const timeField = this.getTimeField();

      events = events
        .filter((item) => Date.parse(item[timeField]) > lastDatetime);
      if (maxResults && (events.length > maxResults)) events.length = maxResults;
      if (events.length) this._setLastDatetime(Date.parse(events[0][timeField]));

      for (const asset of events.reverse()) {
        this.$emit(asset, this.generateMeta(asset));
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

import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import waitlist from "../../waitlist.app.mjs";

export default {
  props: {
    waitlist,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Waitlist API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastValue() {
      return this.db.get("lastValue") || 0;
    },
    _setLastValue(lastValue) {
      this.db.set("lastValue", lastValue);
    },
    getProps() {
      return {};
    },
    async startEvent(maxResults = 0) {
      const lastValue = this._getLastValue();
      const fn = this.getFunction();
      const field = this.getField();

      const items = await fn({
        ...this.getProps(),
      });

      const filteredResponse = items.filter((item) => this.getFilter(item[field], lastValue));

      if (filteredResponse.length) {
        if (maxResults && filteredResponse.length > maxResults) {
          filteredResponse.length = maxResults;
        }
        this._setLastValue(filteredResponse[filteredResponse.length - 1][field]);
      }

      for (const item of filteredResponse) {
        this.$emit( item, {
          id: item.id || item.uuid,
          summary: this.getSummary(item),
          ts: Date.parse(item.created_at),
        });
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

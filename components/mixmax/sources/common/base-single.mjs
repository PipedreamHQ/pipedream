import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import teamgate from "../../teamgate.app.mjs";

export default {
  props: {
    teamgate,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Teamgate API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastValue() {
      return this.db.get("lastValue");
    },
    _setLastValue(lastValue) {
      this.db.set("lastValue", lastValue);
    },
    async processEvent(item) {
      const lastValue = this._getLastValue();
      const actualValue = this.getActualValue(item);

      if (!lastValue || (actualValue != lastValue)) {
        this._setLastValue(actualValue);
        this.$emit(item, this.getDataToEmit(item));
      }
    },
    getDataToEmit({
      id, ...item
    }) {
      return {
        id,
        summary: this.getSummary(item),
        ts: new Date(),
      };
    },
  },
  async run() {
    const fn = this.getFn();

    const { data } = await fn;
    this.processEvent(data);
  },
};


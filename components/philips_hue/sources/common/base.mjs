import philipsHue from "../../philips_hue.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    philipsHue,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    username: {
      propDefinition: [
        philipsHue,
        "username",
      ],
    },
  },
  methods: {
    _getPreviousData() {
      return this.db.get("previousData") || {};
    },
    _setPreviousData(data) {
      this.db.set("previousData", data);
    },
    emitEvent(item) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    },
    generateMeta(item) {
      const ts = Date.now();
      return {
        id: `${item.id}${ts}`,
        summary: this.getSummary(item),
        ts,
      };
    },
    getSummary() {
      throw new Error("getSummary is not implemented");
    },
  },
};

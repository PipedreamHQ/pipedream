import dnsfilter from "../../dnsfilter.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    dnsfilter,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLast() {
      return this.db.get("last") ?? 0;
    },
    _setLast(last) {
      this.db.set("last", last);
    },
  },
};

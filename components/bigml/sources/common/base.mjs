import bigml from "../../bigml.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    bigml,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    getLastDate() {
      const lastDate = this.db.get("lastDate") || new Date();
      return lastDate.toISOString().slice(0, -1);
    },
    setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
  },
};

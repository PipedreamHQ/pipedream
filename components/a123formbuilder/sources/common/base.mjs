import a123formbuilder from "../../a123formbuilder.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    a123formbuilder,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    getPage() {
      return this.db.get("page") || 1;
    },
    setPage(page) {
      this.db.set("page", page);
    },
  },
};

import qualaroo from "../../qualaroo.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    qualaroo,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    getOffset() {
      return this.db.get("offset") ?? 0;
    },
    setOffset(offset) {
      this.db.set("offset", offset);
    },
  },
};

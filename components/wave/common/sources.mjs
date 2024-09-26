import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../wave.app.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    businessId: {
      propDefinition: [
        app,
        "businessId",
      ],
      description: "The ID of the business to create the invoice for.",
    },
  },
  methods: {
    setLastEventId(lastEventId) {
      this.db.set("lastEventId", lastEventId);
    },
    getLastEventId() {
      return this.db.get("lastEventId");
    },
  },
};

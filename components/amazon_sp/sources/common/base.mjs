import amazonSellingPartner from "../../amazon_sp.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    amazonSellingPartner,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    marketplaceId: {
      propDefinition: [
        amazonSellingPartner,
        "marketplaceId",
      ],
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || new Date(Date.now() - 1000 * 60 * 60).toISOString();
    },
    _setLastTs(ts) {
      this.db.set("lastTs", ts);
    },
  },
};

import shopify from "../shopify_partner.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    shopify,
    db: "$.service.db",
    timer: {
      description: "API Polling Frequency",
      type: "$.interface.timer",
      label: "timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  dedupe: "unique",
};

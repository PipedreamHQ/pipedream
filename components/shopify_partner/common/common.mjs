import shopify from "../shopify_partner.app.mjs";

export default {
  props: {
    shopify,
    db: "$.service.db",
    timer: {
      description: "API Polling Frequency",
      type: "$.interface.timer",
      label: "timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  dedupe: "unique",
};

import tmdb from "../tmdb.app.mjs";

export default {
  props: {
    tmdb,
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

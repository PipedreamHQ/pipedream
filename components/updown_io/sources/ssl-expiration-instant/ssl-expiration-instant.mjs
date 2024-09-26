import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "updown_io-ssl-expiration-instant",
  name: "SSL Expiration (Instant)",
  description: "Emit new event when an SSL certificate expiration is detected [See the documentation](https://updown.io/api#webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    threshold: {
      type: "string",
      label: "Threshold",
      description: "Days before SSL expiration to emit an event",
      options: [
        "1",
        "7",
        "14",
        "30",
      ],
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        "check.ssl_expiration",
      ];
    },
    isRelevant(event) {
      return !this.threshold
        || (event?.ssl && event.ssl.days_before_expiration === +this.threshold);
    },
  },
  sampleEmit,
};

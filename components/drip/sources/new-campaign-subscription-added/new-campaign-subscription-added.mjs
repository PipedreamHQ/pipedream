import base from "../common/base.mjs";

export default {
  ...base,
  key: "drip-new-campaign-subscription-added",
  name: "New Campaign Subscription Added (Instant)",
  description: "Emit new event when a subscriber subscribes to an Email Series Campaign.",
  version: "0.0.3",
  dedupe: "unique",
  type: "source",
  methods: {
    ...base.methods,
    getEventType() {
      return "subscriber.subscribed_to_campaign";
    },
    getSummary({
      subscriber: {
        email, first_name, last_name,
      },
      properties: { campaign_name },
    }) {
      let string = `New Subscription in campaign ${campaign_name}: ${email}`;
      if (first_name) string += ` - ${first_name} ${last_name}`;
      return string;
    },
  },
};

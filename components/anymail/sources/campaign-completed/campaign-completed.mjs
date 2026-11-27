import common from "../common/base.mjs";

export default {
  ...common,
  key: "anymail-campaign-completed",
  name: "Campaign Completed (Instant)",
  description: "Emit new event when a campaign ends. [See the docs](https://developers.anymail.watch/webhook-subscriptions/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "campaign_completed";
    },
    getLabel() {
      return "Campaign Completed";
    },
  },
};

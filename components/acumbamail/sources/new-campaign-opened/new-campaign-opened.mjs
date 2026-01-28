import common from "../common/base-webhook.mjs";

export default {
  ...common,
  key: "acumbamail-new-campaign-opened",
  name: "New Campaign Opened (Instant)",
  description: "Emit new event when a campaign is opened. Note: Only one webhook can be configured per list. [See the documentation](https://acumbamail.com/en/apidoc/function/configListWebhook/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "opens";
    },
  },
};

import common from "../common/webhook.mjs";
import triggers from "../common/triggers.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "zylvie-new-affiliate-sign-up-instant",
  name: "New Affiliate Sign Up (Instant)",
  description: "Emit new event when a visitor signs up to be an affiliate or when they accept an invitation to be an affiliate. [See the documentation](https://developers.zylvie.com/webhooks/subscribe).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTriggerName() {
      return triggers.AFFILIATE;
    },
    generateMeta(payload) {
      const { data: resource } = payload;
      const ts = Date.parse(resource.accepted_at);
      return {
        id: resource.id,
        summary: `New Affiliate: ${resource.affiliate.name || resource.affiliate.email}`,
        ts,
      };
    },
  },
  sampleEmit,
};

import common from "../common/base-webhook.mjs";

export default {
  ...common,
  key: "waiverfile-new-waiver-instant",
  name: "New Waiver (Instant)",
  description: "Emit new event each time a new waiver is collected in WaiverFile. [See the documentation](https://api.waiverfile.com/swagger/ui/index#!/Subscription/Subscription_newwaiver)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "newwaiver";
    },
    generateMeta(body) {
      return {
        id: body.WaiverID,
        summary: `New Waiver ${body.WaiverID}`,
        ts: Date.now(),
      };
    },
  },
};

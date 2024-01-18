import common from "../common/base-webhook.mjs";

export default {
  ...common,
  key: "waiverfile-edit-event-instant",
  name: "Edit Event (Instant)",
  description: "Emit new event when an existing event in WaiverFile is edited. [See the documentation](https://api.waiverfile.com/swagger/ui/index#!/Subscription/Subscription_editevent)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "editevent";
    },
    generateMeta(body) {
      const ts = Date.parse(body.LastModified);
      return {
        id: `${body.WaiverEventID}${ts}`,
        summary: `Updated Event ${body.WaiverEventID}`,
        ts,
      };
    },
  },
};

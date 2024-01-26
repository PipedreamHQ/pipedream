import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "waiverfile-new-event-instant",
  name: "New Event (Instant)",
  description: "Emit new event when a new event is created in Waiverfile. [See the documentation](https://api.waiverfile.com/swagger/ui/index#!/Subscription/Subscription_newevent)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "newevent";
    },
    generateMeta(body) {
      return {
        id: body.WaiverEventID,
        summary: `New Event ${body.WaiverEventID}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};

import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "cloudbeds-new-guest-created",
  name: "New Guest Created (Instant)",
  description: "Emit new event when a new guest is created in Cloudbeds. [See the documentation](https://developers.cloudbeds.com/reference/post_postwebhook-2)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getObject() {
      return "guest";
    },
    getAction() {
      return "created";
    },
    generateMeta(body) {
      return {
        id: body.guestId,
        summary: `New guest created with ID: ${body.guestId}`,
        ts: Math.floor(body.timestamp * 1000),
      };
    },
  },
  sampleEmit,
};

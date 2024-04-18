import common from "../common/webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "letterdrop-watch-added-subscribers-instant",
  name: "Watch Added Subscribers (Instant)",
  description: "Emit new event when a new subscriber gets added on Letterdrop. [See the documentation](https://docs.letterdrop.com/webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(resource) {
      const ts = Date.parse(resource.signedUpOn);
      return {
        id: ts,
        summary: `New Subscriber: ${resource.email}`,
        ts,
      };
    },
  },
  sampleEmit,
};

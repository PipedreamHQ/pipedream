import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "flodesk-subscriber-unsubscribed",
  name: "Subscriber Unsubscribed",
  description: "Emit new event when a subscriber is unsubscribed in Flodesk. [See the documentation](https://developers.flodesk.com/#tag/webhook-event/operation/subscriber.unsubscribed)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "subscriber.unsubscribed",
      ];
    },
    generateMeta(event) {
      return {
        id: event.subscriber.id,
        summary: `Subscriber Unsubscribed ${event.subscriber.id}`,
        ts: Date.parse(event.event_time),
      };
    },
  },
  sampleEmit,
};

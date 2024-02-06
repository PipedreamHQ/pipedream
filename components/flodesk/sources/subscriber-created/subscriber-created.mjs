import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "flodesk-subscriber-created",
  name: "Subscriber Created",
  description: "Emit new event when a subscriber is created in Flodesk. [See the documentation](https://developers.flodesk.com/#tag/webhook-event/operation/subscriber.created)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "subscriber.created",
      ];
    },
    generateMeta(event) {
      return {
        id: event.subscriber.id,
        summary: `New Subscriber ${event.subscriber.id}`,
        ts: Date.parse(event.event_time),
      };
    },
  },
  sampleEmit,
};

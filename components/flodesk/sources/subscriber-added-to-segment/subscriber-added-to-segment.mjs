import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "flodesk-subscriber-added-to-segment",
  name: "Subscriber Added To Segment",
  description: "Emit new event when a subscriber is added to a segment in Flodesk. [See the documentation](https://developers.flodesk.com/#tag/webhook-event/operation/subscriber.added_to_segment)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "subscriber.added_to_segment",
      ];
    },
    generateMeta(event) {
      return {
        id: `${event.subscriber.id}-${event.segment.id}`,
        summary: `Subscriber ${event.subscriber.id} added to segment ${event.segment.id}`,
        ts: Date.parse(event.event_time),
      };
    },
  },
  sampleEmit,
};

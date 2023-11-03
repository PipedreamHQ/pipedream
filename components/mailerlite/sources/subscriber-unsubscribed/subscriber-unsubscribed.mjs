import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "mailerlite-subscriber-unsubscribed",
  name: "New Subscriber Unsubscribed (Instant)",
  description: "Emit new event when a subscriber is unsubscribed.",
  version: "0.0.1",
  type: "source",
  props: {
    ...common.props,
    http: "$.interface.http",
    db: "$.service.db",
  },
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "subscriber.unsubscribed",
      ];
    },
    getDataToEmit({
      id,
      created_at: createdAt,
    }) {
      return {
        id: id,
        summary: `The subscriber with Id: ${id} has been unsubscribed!`,
        ts: new Date(createdAt),
      };
    },
  },
  sampleEmit,
};

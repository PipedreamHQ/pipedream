import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "mailerlite-subscriber-created",
  name: "New Subscriber Created (Instant)",
  description: "Emit new event when a new subscriber is created.",
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
        "subscriber.created",
      ];
    },
    getDataToEmit({
      id,
      created_at: createdAt,
    }) {
      return {
        id: id,
        summary: `A new subscriber with Id: ${id} has been created!`,
        ts: new Date(createdAt),
      };
    },
  },
  sampleEmit,
};

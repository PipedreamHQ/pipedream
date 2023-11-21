import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "mailerlite-subscriber-added-from-form",
  name: "New Subscriber Added From Form (Instant)",
  description: "Emit new event when a new subscriber is added though a form.",
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
        "subscriber.added_through_form",
      ];
    },
    getDataToEmit({
      id,
      created_at: createdAt,
    }) {
      return {
        id: id,
        summary: `A new subscriber with Id: ${id} has been added though a form!`,
        ts: new Date(createdAt),
      };
    },
  },
  sampleEmit,
};

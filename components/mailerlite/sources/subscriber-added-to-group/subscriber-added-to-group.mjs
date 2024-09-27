import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "mailerlite-subscriber-added-to-group",
  name: "New Subscriber Added To Group (Instant)",
  description: "Emit new event when a new subscriber is added to a group.",
  version: "0.0.2",
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
        "subscriber.added_to_group",
      ];
    },
    getDataToEmit({
      subscriber,
      group,
    }) {
      return {
        id: `${subscriber.id}-${group.id}`,
        summary: `A new subscriber with Id: ${subscriber.id} has been added to a group`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};

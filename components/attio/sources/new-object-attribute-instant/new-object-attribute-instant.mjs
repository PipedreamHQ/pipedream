import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "attio-new-object-attribute-instant",
  name: "New Object Attribute (Instant)",
  description: "Emit new event when an object attribute is created (e.g. when defining a new attribute \"Rating\" on the company object)",
  version: "0.0.5",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSubscriptions() {
      return [
        {
          event_type: "object-attribute.created",
          filter: null,
        },
      ];
    },
    generateMeta(attribute) {
      return {
        id: attribute.id.attribute_id,
        summary: `New Object Attribute with ID: ${attribute.id.attribute_id}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};

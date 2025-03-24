import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "attio-object-attribute-updated-instant",
  name: "Object Attribute Updated (Instant)",
  description: "Emit new event when an object attribute is updated (e.g. when renaming the \"Rating\" attribute to \"Score\" on the company object)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "object-attribute.updated";
    },
    generateMeta(attribute) {
      const ts = Date.now();
      return {
        id: `${attribute.id.attribute_id}-${ts}`,
        summary: `New Object Attribute with ID: ${attribute.id.attribute_id}`,
        ts,
      };
    },
  },
  sampleEmit,
};

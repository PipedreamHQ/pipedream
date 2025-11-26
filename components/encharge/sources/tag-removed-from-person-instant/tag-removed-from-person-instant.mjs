import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "encharge-tag-removed-from-person-instant",
  name: "Tag Removed from Person (Instant)",
  description: "Emit new event when a tag is removed from a person.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    tagId: {
      type: "string",
      label: "Tag ID",
      description: "Tag ID to remove from person.",
    },
  },
  methods: {
    ...common.methods,
    getEvent() {
      return `removed-tag-${this.tagId}`;
    },
    generateMeta({
      endUserData: [
        { id },
      ],
    }) {
      return {
        id: `${id}-${this.tagId}`,
        summary: `Tag ${this.tagId} removed from person with ID ${id}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};

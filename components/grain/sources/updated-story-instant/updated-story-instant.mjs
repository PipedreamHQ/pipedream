import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "grain-updated-story-instant",
  name: "New Story Updated (Instant)",
  description: "Emit new event when a story is updated.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    viewId: {
      propDefinition: [
        common.props.grain,
        "viewId",
        () => ({
          type: "stories",
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getAction() {
      return [
        "updated",
      ];
    },
    getSummary({ data }) {
      return `New story updated: ${data.id}`;
    },
  },
  sampleEmit,
};

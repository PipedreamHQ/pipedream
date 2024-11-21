import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "grain-removed-story-instant",
  name: "New Story Removed (Instant)",
  description: "Emit new event when a story is removed.",
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
        "removed",
      ];
    },
    getSummary({ data }) {
      return `New story removed: ${data.id}`;
    },
  },
  sampleEmit,
};

import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "grain-new-story-instant",
  name: "New Story (Instant)",
  description: "Emit new event when a story that matches the filter is added.",
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
        "added",
      ];
    },
    getSummary({ data }) {
      return `New story added: ${data.id}`;
    },
  },
  sampleEmit,
};

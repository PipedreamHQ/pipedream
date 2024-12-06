import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "grain-updated-highlight-instant",
  name: "New Highlight Updated (Instant)",
  description: "Emit new event when a highlight is updated.",
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
          type: "highlights",
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
      return `New highlight updated: ${data.id}`;
    },
  },
  sampleEmit,
};

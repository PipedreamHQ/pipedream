import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "grain-new-highlight-instant",
  name: "New Highlight (Instant)",
  description: "Emit new event when a highlight that matches the filter is added.",
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
        "added",
      ];
    },
    getSummary({ data }) {
      return `New highlight added: ${data.id}`;
    },
  },
  sampleEmit,
};

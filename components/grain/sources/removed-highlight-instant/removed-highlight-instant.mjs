import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "grain-removed-highlight-instant",
  name: "New Highlight Removed (Instant)",
  description: "Emit new event when a highlight is removed.",
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
        "removed",
      ];
    },
    getSummary({ data }) {
      return `Highlight removed from recording ${data.recording_id}`;
    },
  },
  sampleEmit,
};

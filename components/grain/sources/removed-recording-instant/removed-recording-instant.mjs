import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "grain-removed-recording-instant",
  name: "New Recording Removed (Instant)",
  description: "Emit new event when a recording is removed.",
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
          type: "recordings",
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
      return `Recording removed: ${data.id}`;
    },
  },
  sampleEmit,
};

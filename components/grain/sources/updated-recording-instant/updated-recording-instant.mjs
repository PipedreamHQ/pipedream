import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "grain-updated-recording-instant",
  name: "New Recording Updated (Instant)",
  description: "Emit new event when a recording is updated.",
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
        "updated",
      ];
    },
    getSummary({ data }) {
      return `New recording updated: ${data.id}`;
    },
  },
  sampleEmit,
};

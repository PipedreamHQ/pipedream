import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "grain-new-recording-instant",
  name: "New Recording (Instant)",
  description: "Emit new event when a recording that matches the filter is added.",
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
        "added",
      ];
    },
    getSummary({ data }) {
      return `New recording added: ${data.id}`;
    },
  },
  sampleEmit,
};

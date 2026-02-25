import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "nutshell-new-person",
  name: "New Person Profile Created",
  description: "Emit new event when a new person profile is created.",
  version: "0.0.2",
  type: "source",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  dedupe: "unique",
  methods: {
    ...common.methods,
    getMethod() {
      return "findContacts";
    },
    getSummary({
      name, id,
    }) {
      return `New Person: ${name || id}`;
    },
  },
  sampleEmit,
};

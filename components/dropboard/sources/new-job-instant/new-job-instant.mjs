import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "dropboard-new-job-instant",
  name: "New Job Created (Instant)",
  description: "Emit new event when a new job is created.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    hiringManagerEmail: {
      propDefinition: [
        common.props.dropboard,
        "hiringManagerEmail",
      ],
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getData() {
      return {
        hiringManagerEmail: this.hiringManagerEmail,
      };
    },
    getPath() {
      return "jobs";
    },
    getSummary(body) {
      return `New Job: ${body.title}`;
    },
  },
  sampleEmit,
};

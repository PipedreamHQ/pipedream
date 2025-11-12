import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "dropboard-new-candidate-instant",
  name: "New Candidate Profile Created (Instant)",
  description: "Emit new event when a candidate profile is created.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    jobId: {
      propDefinition: [
        common.props.dropboard,
        "jobId",
      ],
      optional: true,
    },
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
        jobId: this.jobId,
        hiringManagerEmail: this.hiringManagerEmail,
      };
    },
    getPath() {
      return "candidates";
    },
    getSummary(body) {
      return `New Candidate: ${body.first} ${body.last} ${body.email}`;
    },
  },
  sampleEmit,
};

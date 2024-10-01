import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "talenthr-new-ats-application",
  name: "New Job Application Submitted",
  description: "Emit new event when a new job application is submitted. [See the documentation](https://apidocs.talenthr.io/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    jobPositionId: {
      propDefinition: [
        common.props.talenthr,
        "jobPositionId",
      ],
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getConfig() {
      return {
        jobPositionId: this.jobPositionId,
        params: {
          order: "desc",
          sort: "created_at",
        },
      };
    },
    getFunction() {
      return this.talenthr.listNewJobApplications;
    },
    getSummary(item) {
      return `New Job Application: ${item.id}`;
    },
  },
  sampleEmit,
};

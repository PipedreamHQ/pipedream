import niceboard from "../../niceboard.app.mjs";

export default {
  key: "niceboard-create-job-alert",
  name: "Create Job Alert",
  description: "Generates a new job alert for a job seeker registered on the niceboard app",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    niceboard,
    jobSeekerId: {
      propDefinition: [
        niceboard,
        "jobSeekerId",
      ],
    },
    keywords: {
      propDefinition: [
        niceboard,
        "keywords",
      ],
    },
    frequency: {
      propDefinition: [
        niceboard,
        "frequency",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const options = {
      data: {
        jobSeekerId: this.jobSeekerId,
        keywords: this.keywords,
        frequency: this.frequency,
      },
    };
    const result = await this.niceboard.createJobAlert(options);

    $.export("$summary", `Created job alert for job seeker ID: ${this.jobSeekerId}`);
    return result;
  },
};

import smartymeet from "../../smartymeet.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "smartymeet-create-job",
  name: "Create Job",
  description: "Generates a new job in the SmartyMeet system. [See the documentation](https://docs.smartymeet.com/smartymeet_versioned/jobs)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    smartymeet,
    jobTitle: {
      propDefinition: [
        smartymeet,
        "jobTitle",
      ],
    },
    jobDescription: {
      propDefinition: [
        smartymeet,
        "jobDescription",
      ],
    },
    jobLocation: {
      propDefinition: [
        smartymeet,
        "jobLocation",
      ],
      optional: true,
    },
    jobSalary: {
      propDefinition: [
        smartymeet,
        "jobSalary",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.smartymeet.generateNewJob({
      jobTitle: this.jobTitle,
      jobDescription: this.jobDescription,
      jobLocation: this.jobLocation,
      jobSalary: this.jobSalary,
    });

    $.export("$summary", `Successfully created job with title "${this.jobTitle}"`);
    return response;
  },
};

import taleez from "../../taleez.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "taleez-create-job",
  name: "Create Job Listing",
  description: "Creates a new job listing. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    taleez,
    jobTitle: {
      propDefinition: [
        taleez,
        "jobTitle",
      ],
    },
    department: {
      propDefinition: [
        taleez,
        "department",
      ],
    },
    jobDescription: {
      propDefinition: [
        taleez,
        "jobDescription",
      ],
    },
    jobLocation: {
      propDefinition: [
        taleez,
        "jobLocation",
      ],
      optional: true,
    },
    jobType: {
      propDefinition: [
        taleez,
        "jobType",
      ],
      optional: true,
    },
    applicationDeadline: {
      propDefinition: [
        taleez,
        "applicationDeadline",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.taleez.createJobListing();
    $.export("$summary", `Job "${this.jobTitle}" created with ID ${response.id}`);
    return response;
  },
};

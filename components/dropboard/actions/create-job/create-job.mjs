import { parseObject } from "../../common/utils.mjs";
import dropboard from "../../dropboard.app.mjs";

export default {
  key: "dropboard-create-job",
  name: "Create Job",
  description: "Creates a new job within Dropboard. [See the documentation](https://dropboard.readme.io/reference/jobs-post)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    dropboard,
    title: {
      type: "string",
      label: "Title",
      description: "The title of the job",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the job",
    },
    hiringManagerEmails: {
      type: "string[]",
      label: "Hiring Manager Emails",
      description: "The emails of the hiring managers",
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the job",
      options: [
        "open",
        "closed",
      ],
      optional: true,
    },
    locations: {
      type: "string[]",
      label: "Locations",
      description: "Locations of the job",
      optional: true,
    },
    qualifications: {
      type: "string",
      label: "Qualifications",
      description: "The qualifications required for the job",
      optional: true,
    },
    responsibilities: {
      type: "string",
      label: "Responsibilities",
      description: "The responsibilities of the job",
      optional: true,
    },
    compensation: {
      type: "string",
      label: "Compensation",
      description: "The compensation for the job",
      optional: true,
    },
    openDateStart: {
      type: "string",
      label: "Open Date Start",
      description: "If only open during a timeframe, this is the start day",
      optional: true,
    },
    openDateEnd: {
      type: "string",
      label: "Open Date End",
      description: "If only open during a timeframe, this is the end day",
      optional: true,
    },
    jobCode: {
      type: "string",
      label: "Job Code",
      description: "Specify a unique job code. Will be generated if not specified",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.dropboard.createJob({
      $,
      data: {
        title: this.title,
        description: this.description,
        hiringManagerEmails: parseObject(this.hiringManagerEmails),
        clientId: this.clientId,
        status: this.status,
        locations: parseObject(this.locations),
        qualifications: this.qualifications,
        responsibilities: this.responsibilities,
        compensation: this.compensation,
        openDateStart: this.openDateStart,
        openDateEnd: this.openDateEnd,
        jobCode: this.jobCode,
      },
    });
    $.export("$summary", `Successfully created job with Id: ${response.id}`);
    return response;
  },
};

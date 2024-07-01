import dropboard from "../../dropboard.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "dropboard-create-job",
  name: "Create Job",
  description: "Creates a new job within Dropboard. [See the documentation](https://dropboard.readme.io/reference/jobs-post)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    dropboard,
    title: {
      propDefinition: [
        dropboard,
        "title",
      ],
    },
    description: {
      propDefinition: [
        dropboard,
        "description",
      ],
    },
    hiringManagerEmails: {
      propDefinition: [
        dropboard,
        "hiringManagerEmails",
      ],
    },
    clientId: {
      propDefinition: [
        dropboard,
        "clientId",
      ],
      optional: true,
    },
    status: {
      propDefinition: [
        dropboard,
        "status",
      ],
      optional: true,
    },
    location: {
      propDefinition: [
        dropboard,
        "location",
      ],
      optional: true,
    },
    qualifications: {
      propDefinition: [
        dropboard,
        "qualifications",
      ],
      optional: true,
    },
    responsibilities: {
      propDefinition: [
        dropboard,
        "responsibilities",
      ],
      optional: true,
    },
    compensation: {
      propDefinition: [
        dropboard,
        "compensation",
      ],
      optional: true,
    },
    openDateStart: {
      propDefinition: [
        dropboard,
        "openDateStart",
      ],
      optional: true,
    },
    openDateEnd: {
      propDefinition: [
        dropboard,
        "openDateEnd",
      ],
      optional: true,
    },
    jobCode: {
      propDefinition: [
        dropboard,
        "jobCode",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      title: this.title,
      description: this.description,
      hiringManagerEmails: this.hiringManagerEmails,
      clientId: this.clientId,
      status: this.status,
      location: this.location,
      qualifications: this.qualifications,
      responsibilities: this.responsibilities,
      compensation: this.compensation,
      openDateStart: this.openDateStart,
      openDateEnd: this.openDateEnd,
      jobCode: this.jobCode,
    };

    const response = await this.dropboard.createJob({
      data,
    });
    $.export("$summary", `Successfully created job with title: ${this.title}`);
    return response;
  },
};

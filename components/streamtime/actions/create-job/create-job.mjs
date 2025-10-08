import streamtime from "../../streamtime.app.mjs";

export default {
  key: "streamtime-create-job",
  name: "Create Job",
  description: "Create a new job in Streamtime. [See the documentation](https://documenter.getpostman.com/view/802974/RWgtSwbn?version=latest#3c29e1b5-7890-4d03-bc6c-fd3a12c45e84).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    streamtime,
    companyId: {
      propDefinition: [
        streamtime,
        "companyId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the new job",
    },
    contactId: {
      propDefinition: [
        streamtime,
        "contactId",
        (c) => ({
          companyId: c.companyId,
        }),
      ],
    },
    jobNumber: {
      type: "string",
      label: "Job Number",
      description: "The job number of the new job",
    },
    budget: {
      type: "string",
      label: "Budget",
      description: "Budget of the new job",
    },
  },
  async run({ $ }) {
    const data = {
      name: this.name,
      number: this.jobNumber,
      budget: this.budget,
      company: {
        id: this.companyId,
      },
      contact: {
        id: this.contactId,
      },
      jobLeadUserId: null,
    };

    const response = await this.streamtime.createJob({
      data,
      $,
    });

    if (response.id) {
      $.export("$summary", `Successfully created job with ID ${response.id}.`);
    }

    return response;
  },
};

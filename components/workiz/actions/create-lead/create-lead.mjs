import workiz from "../../workiz.app.mjs";

export default {
  key: "workiz-create-lead",
  name: "Create Lead",
  description: "Create a new lead in Workiz. [See the documentation](https://developer.workiz.com/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    workiz,
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the lead",
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the lead",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the lead",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the lead",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "Company name of the lead",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "Street address of the service location",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City of the service location",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "State of the service location",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "Postal Code of the service location",
      optional: true,
    },
    leadDateTime: {
      type: "string",
      label: "Job Datetime",
      description: "The datetime of the lead in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format, e.g. `2016-08-29T09:12:33.001Z`",
      optional: true,
    },
    jobType: {
      type: "string",
      label: "Job Type",
      description: "The type of job",
      optional: true,
    },
    jobSource: {
      type: "string",
      label: "Job Source",
      description: "The source of job",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.workiz.createLead({
      data: {
        Email: this.email,
        Phone: this.phone,
        FirstName: this.firstName,
        LastName: this.lastName,
        Company: this.company,
        Address: this.address,
        City: this.city,
        PostalCode: this.postalCode,
        LeadDateTime: this.leadDateTime,
        JobType: this.jobType,
        JobSource: this.jobSource,
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created new lead with ID ${response.data[0].UUID}.`);
    }

    return response;
  },
};

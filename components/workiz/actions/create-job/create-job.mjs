import workiz from "../../workiz.app.mjs";

export default {
  key: "workiz-create-job",
  name: "Create Job",
  description: "Creates a new job in Workiz. [See the documentation](https://developer.workiz.com/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    workiz,
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the client",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the client",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the client",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the client",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "Street address of the service location",
    },
    city: {
      type: "string",
      label: "City",
      description: "City of the service location",
    },
    state: {
      type: "string",
      label: "State",
      description: "State of the service location",
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "Postal Code of the service location",
    },
    jobType: {
      type: "string",
      label: "Job Type",
      description: "The type of job",
    },
    jobDateTime: {
      type: "string",
      label: "Job Datetime",
      description: "The datetime of the job in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format, e.g. `2016-08-29T09:12:33.001Z`",
    },
  },
  async run({ $ }) {
    const response = await this.workiz.createJob({
      data: {
        FirstName: this.firstName,
        LastName: this.lastName,
        Email: this.email,
        Phone: this.phone,
        Address: this.address,
        City: this.city,
        State: this.state,
        PostalCode: this.postalCode,
        JobType: this.jobType,
        JobDateTime: this.jobDateTime,
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created new job with ID ${response.data[0].UUID}.`);
    }

    return response;
  },
};

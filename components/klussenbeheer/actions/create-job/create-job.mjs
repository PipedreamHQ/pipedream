import klussenbeheer from "../../klussenbeheer.app.mjs";

export default {
  key: "klussenbeheer-create-job",
  name: "Create Job",
  description: "Create a new job for a customer. Depending on the organization settings, this can send a notification to the account owner or admin. [See the documentation](https://samdesk.nl/klussenbeheer/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: false,
  },
  ai: "optimized",
  props: {
    klussenbeheer,
    customerName: {
      propDefinition: [
        klussenbeheer,
        "customerName",
      ],
    },
    phone: {
      propDefinition: [
        klussenbeheer,
        "phone",
      ],
    },
    email: {
      propDefinition: [
        klussenbeheer,
        "email",
      ],
    },
    jobType: {
      propDefinition: [
        klussenbeheer,
        "jobType",
      ],
    },
    jobAddress: {
      propDefinition: [
        klussenbeheer,
        "jobAddress",
      ],
    },
    jobDescription: {
      propDefinition: [
        klussenbeheer,
        "jobDescription",
      ],
    },
    nextAction: {
      propDefinition: [
        klussenbeheer,
        "nextAction",
      ],
    },
    postalCode: {
      propDefinition: [
        klussenbeheer,
        "postalCode",
      ],
      description: "Postal code of the job.",
    },
    houseNumber: {
      propDefinition: [
        klussenbeheer,
        "houseNumber",
      ],
      description: "House number of the job.",
    },
  },
  async run({ $ }) {
    const job = await this.klussenbeheer.createJob($, {
      customerName: this.customerName,
      phone: this.phone,
      email: this.email,
      jobType: this.jobType,
      jobAddress: this.jobAddress,
      jobDescription: this.jobDescription,
      nextAction: this.nextAction,
      postalCode: this.postalCode,
      houseNumber: this.houseNumber,
    });

    $.export("$summary", `Job #${job.id ?? "?"} created`);

    return job;
  },
};

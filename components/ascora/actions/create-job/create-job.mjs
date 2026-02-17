import ascora from "../../ascora.app.mjs";

export default {
  key: "ascora-create-job",
  name: "Create Job",
  description: "Create a job in the Ascora system. [See the documentation](https://www.ascora.com.au/Assets/Guides/AscoraApiGuide.pdf)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ascora,
    siteCustomer: {
      propDefinition: [
        ascora,
        "customerId",
      ],
      label: "Site Customer",
      description: "The site customer of the job",
      optional: false,
    },
    jobName: {
      type: "string",
      label: "Job Name",
      description: "The name of the job",
      optional: true,
    },
    jobDescription: {
      type: "string",
      label: "Job Description",
      description: "The description of the job",
      optional: true,
    },
    workUndertaken: {
      type: "string",
      label: "Work Undertaken",
      description: "The work undertaken for the job",
      optional: true,
    },
    pricingMethod: {
      type: "string",
      label: "Pricing Method",
      description: "The pricing method for the job. Example: `FIXED-PRICE`",
      optional: true,
    },
    totalIncTax: {
      type: "string",
      label: "Total Inc Tax",
      description: "The total including tax for the job",
      optional: true,
    },
    totalExTax: {
      type: "string",
      label: "Total Ex Tax",
      description: "The total excluding tax for the job",
      optional: true,
    },
    addressLine1: {
      type: "string",
      label: "Address Line 1",
      description: "The first line of the address of the job",
      optional: true,
    },
    addressLine2: {
      type: "string",
      label: "Address Line 2",
      description: "The second line of the address of the job",
      optional: true,
    },
    suburb: {
      type: "string",
      label: "Suburb",
      description: "The suburb of the address of the job",
      optional: true,
    },
    postcode: {
      type: "string",
      label: "Postcode",
      description: "The postcode of the address of the job",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The country of the address of the job",
      optional: true,
    },
    billingCustomer: {
      propDefinition: [
        ascora,
        "customerId",
      ],
      label: "Billing Customer",
      description: "The billing customer of the job",
    },
    completedDate: {
      type: "string",
      label: "Completed Date",
      description: "The completed date of the job. Example: `2021-01-12T20:55:03.837`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.ascora.createJob({
      $,
      data: {
        jobName: this.jobName,
        jobDescription: this.jobDescription,
        workUndertaken: this.workUndertaken,
        pricingMethod: this.pricingMethod,
        totalIncTax: this.totalIncTax
          ? Number(this.totalIncTax)
          : undefined,
        totalExTax: this.totalExTax
          ? Number(this.totalExTax)
          : undefined,
        addressLine1: this.addressLine1,
        addressLine2: this.addressLine2,
        suburb: this.suburb,
        postcode: this.postcode,
        country: this.country,
        siteCustomer: this.siteCustomer
          ? {
            id: this.siteCustomer,
          }
          : undefined,
        billingCustomer: this.billingCustomer
          ? {
            id: this.billingCustomer,
          }
          : undefined,
        completedDate: this.completedDate,
      },
    });
    if (response.success) {
      $.export("$summary", `Successfully created job with ID ${response.job.jobId}`);
    } else {
      throw new Error(response.message);
    }
    return response;
  },
};

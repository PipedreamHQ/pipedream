import niceboard from "../../niceboard.app.mjs";

export default {
  key: "niceboard-update-job",
  name: "Update Job",
  description: "Updates an existing job posting within the Niceboard app.",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    niceboard,
    niceboardUrl: {
      propDefinition: [
        niceboard,
        "niceboardUrl",
      ],
    },
    jobId: {
      propDefinition: [
        niceboard,
        "jobId",
        (c) => ({
          niceboardUrl: c.niceboardUrl,
        }),
      ],
    },
    title: {
      propDefinition: [
        niceboard,
        "title",
      ],
      optional: true,
    },
    description: {
      propDefinition: [
        niceboard,
        "description",
      ],
      optional: true,
    },
    companyId: {
      propDefinition: [
        niceboard,
        "companyId",
        (c) => ({
          niceboardUrl: c.niceboardUrl,
        }),
      ],
      optional: true,
    },
    jobTypeId: {
      propDefinition: [
        niceboard,
        "jobTypeId",
        (c) => ({
          niceboardUrl: c.niceboardUrl,
        }),
      ],
      optional: true,
    },
    categoryId: {
      propDefinition: [
        niceboard,
        "categoryId",
        (c) => ({
          niceboardUrl: c.niceboardUrl,
        }),
      ],
      optional: true,
    },
    locationId: {
      propDefinition: [
        niceboard,
        "locationId",
        (c) => ({
          niceboardUrl: c.niceboardUrl,
        }),
      ],
      optional: true,
    },
    minSalary: {
      propDefinition: [
        niceboard,
        "minSalary",
      ],
    },
    maxSalary: {
      propDefinition: [
        niceboard,
        "maxSalary",
      ],
    },
    salaryTimeframe: {
      propDefinition: [
        niceboard,
        "salaryTimeframe",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.niceboard.updateJob({
      $,
      niceboardUrl: this.niceboardUrl,
      jobId: this.jobId,
      data: {
        title: this.title,
        description_html: this.description,
        company_id: this.companyId,
        jobtype_id: this.jobTypeId,
        category_id: this.categoryId,
        location_id: this.locationId,
        salary_min: this.minSalary,
        salary_max: this.maxSalary,
        salary_timeframe: this.salaryTimeframe,
      },
    });

    if (response?.job?.id) {
      $.export("$summary", `Successfully updated job with ID: ${response.job.id}`);
    }
    return response;
  },
};

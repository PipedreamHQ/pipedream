import niceboard from "../../niceboard.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "niceboard-create-job",
  name: "Create Job",
  description: "Creates a new job posting within the Niceboard app.",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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
    title: {
      propDefinition: [
        niceboard,
        "title",
      ],
    },
    description: {
      propDefinition: [
        niceboard,
        "description",
      ],
    },
    companyId: {
      propDefinition: [
        niceboard,
        "companyId",
        (c) => ({
          niceboardUrl: c.niceboardUrl,
        }),
      ],
    },
    jobTypeId: {
      propDefinition: [
        niceboard,
        "jobTypeId",
        (c) => ({
          niceboardUrl: c.niceboardUrl,
        }),
      ],
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
    if ((this.minSalary || this.maxSalary) && !this.salaryTimeframe) {
      throw new ConfigurationError("Salary Timeframe is required if Minimum Salary or Maximum Salary is entered");
    }

    const response = await this.niceboard.createJob({
      $,
      niceboardUrl: this.niceboardUrl,
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
        apply_by_form: true,
      },
    });

    if (response?.job?.id) {
      $.export("$summary", `Successfully created job with ID: ${response.job.id}`);
    }
    return response;
  },
};

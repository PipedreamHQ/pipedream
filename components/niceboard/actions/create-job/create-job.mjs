import niceboard from "../../niceboard.app.mjs";

export default {
  key: "niceboard-create-job",
  name: "Create Job",
  description: "Creates a new job posting within the Niceboard app.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    niceboard,
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
    category: {
      propDefinition: [
        niceboard,
        "category",
      ],
    },
    company: {
      propDefinition: [
        niceboard,
        "company",
      ],
    },
    jobType: {
      propDefinition: [
        niceboard,
        "jobType",
      ],
      optional: true,
    },
    location: {
      propDefinition: [
        niceboard,
        "location",
      ],
      optional: true,
    },
    salaryRange: {
      propDefinition: [
        niceboard,
        "salaryRange",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.niceboard.postJob({
      data: {
        title: this.title,
        description: this.description,
        category: this.category,
        company: this.company,
        jobType: this.jobType,
        location: this.location,
        salaryRange: this.salaryRange,
      },
    });

    $.export("$summary", `Successfully created job with ID: ${response.id}`);
    return response;
  },
};

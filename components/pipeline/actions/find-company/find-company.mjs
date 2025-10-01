import pipeline from "../../pipeline.app.mjs";

export default {
  name: "Find Company",
  key: "pipeline-find-company",
  description: "Find an existing company in your Pipeline account. [See the docs here](https://app.pipelinecrm.com/api/docs#tag/Companies/paths/~1companies/get)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pipeline,
    companyId: {
      propDefinition: [
        pipeline,
        "companyId",
      ],
    },
    name: {
      propDefinition: [
        pipeline,
        "name",
      ],
      description: "Return companies that have a name that exactly matches or starts with the provided string",
      optional: true,
    },
    email: {
      propDefinition: [
        pipeline,
        "email",
      ],
      description: "Return companies that have an email that exactly matches or starts with the provided string",
    },
  },
  async run({ $ }) {
    const data = {
      conditions: {
        company_id: this.companyId,
        company_name: this.name,
        company_email: this.email,
      },
    };

    const { results: companies } = await this.pipeline.paginate(this.pipeline.listCompanies, {
      data,
      $,
    });

    $.export("$summary", `Found ${companies.length} matching compan${companies.length === 1
      ? "y"
      : "ies"}.`);

    return companies;
  },
};

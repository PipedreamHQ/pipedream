import taleez from "../../taleez.app.mjs";

export default {
  key: "taleez-list-jobs",
  name: "List Jobs",
  description: "Retrieves a list of jobs in your company. [See the documentation](https://api.taleez.com/swagger-ui/index.html#/jobs/list_3)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    taleez,
    unitId: {
      propDefinition: [
        taleez,
        "unitId",
      ],
    },
    status: {
      propDefinition: [
        taleez,
        "status",
      ],
    },
    contract: {
      propDefinition: [
        taleez,
        "contract",
      ],
    },
    city: {
      propDefinition: [
        taleez,
        "city",
      ],
    },
    companyLabel: {
      propDefinition: [
        taleez,
        "companyLabel",
      ],
    },
    tag: {
      propDefinition: [
        taleez,
        "tag",
      ],
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of jobs to retrieve. Default: `100`",
      optional: true,
    },
  },
  async run({ $ }) {
    const { list: jobs } = await this.taleez.listJobs({
      $,
      params: {
        unitId: this.unitId,
        status: this.status,
        contract: this.contract,
        city: this.city,
        companyLabel: this.companyLabel,
        tag: this.tag,
        pageSize: this.maxResults,
        withDetails: true,
        withProps: true,
      },
    });
    $.export("$summary", `Successfully retrieved ${jobs?.length} job${jobs?.length === 1
      ? ""
      : "s"}`);
    return jobs;
  },
};

import enrichlayer from "../../enrichlayer.app.mjs";

export default {
  key: "enrichlayer-get-employee-count",
  name: "Get Employee Count",
  description: "Get the total number of employees of a company from various sources. Cost: 1 credit per successful request. [See the docs](https://enrichlayer.com/docs).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    enrichlayer,
    url: {
      propDefinition: [
        enrichlayer,
        "companyProfileUrl",
      ],
    },
    coyNameMatch: {
      type: "string",
      label: "Company Name Match",
      description: "Include profiles that match the company name in addition to exact URL matches.",
      optional: true,
      options: [
        {
          label: "Include (default)",
          value: "include",
        },
        {
          label: "Exclude",
          value: "exclude",
        },
      ],
    },
    employmentStatus: {
      propDefinition: [
        enrichlayer,
        "employmentStatus",
      ],
    },
    atDate: {
      type: "string",
      label: "At Date",
      description: "Fetch the employee count at a specific date. Format: `YYYY-MM-DD`. Costs 1-5 extra credits depending on plan.",
      optional: true,
    },
    estimatedEmployeeCount: {
      type: "string",
      label: "Estimated Employee Count",
      description: "Include a retrieved employee count from the target company's profile. Costs 1 extra credit.",
      optional: true,
      options: [
        {
          label: "Exclude (default)",
          value: "exclude",
        },
        {
          label: "Include (+1 credit)",
          value: "include",
        },
      ],
    },
    useCache: {
      propDefinition: [
        enrichlayer,
        "useCache",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.enrichlayer._makeRequest({
      $,
      path: "/api/v2/company/employees/count",
      params: {
        url: this.url,
        coy_name_match: this.coyNameMatch,
        employment_status: this.employmentStatus,
        at_date: this.atDate,
        estimated_employee_count: this.estimatedEmployeeCount,
        use_cache: this.useCache,
      },
    });
    $.export("$summary", `Successfully retrieved employee count for ${this.url}`);
    return response;
  },
};

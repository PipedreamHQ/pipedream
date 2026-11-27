import app from "../../jobvetta.app.mjs";

export default {
  key: "jobvetta-get-company-hiring-signals",
  name: "Get Company Hiring Signals",
  description: "Retrieve active job openings and hiring velocity counts for a specific employer. [See the documentation](https://www.jobvetta.com/api)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    company: {
      type: "string",
      label: "Company Name",
      description: "Hiring employer name, e.g. `Datadog`, `Cisco Systems`, or `Stripe`",
    },
    q: {
      propDefinition: [
        app,
        "q",
      ],
      optional: true,
    },
    location: {
      propDefinition: [
        app,
        "location",
      ],
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getCompanyJobs({
      $,
      company: this.company,
      params: {
        q: this.q,
        location: this.location,
        limit: this.limit,
      },
    });
    $.export("$summary", `Retrieved ${response.jobs?.length || 0} of ${response.total || 0} open roles at ${this.company}`);
    return response;
  },
};

import app from "../../jobspipe.app.mjs";

export default {
  key: "jobspipe-get-company-profile",
  name: "Get Company Hiring Profile",
  description: "Get a company's hiring page showing how its hiring is changing (momentum, function mix, AI share, seniority), technology changes, corporate group, business facts, offices, similar companies, layoff notices, and monthly new/closed postings. [See the documentation](https://docs.jobspipe.dev/).",
  version: "0.0.1",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    key: {
      type: "string",
      label: "Company Key",
      description: "A company's `key` from a companies or job search response, or a corporate group as `g-{id}`. Example: `3837186692681720328`.",
    },
    sections: {
      type: "string[]",
      label: "Sections",
      description: "Comma-separated sections to return. Options: `header`, `trends`, `subsidiaries`, `tech_changes`, `facts`, `offices`, `peers`, `layoffs`, `hiring_monthly`. All by default.",
      optional: true,
      options: [
        "header",
        "trends",
        "subsidiaries",
        "tech_changes",
        "facts",
        "offices",
        "peers",
        "layoffs",
        "hiring_monthly",
      ],
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.sections?.length) {
      params.sections = this.sections.join(",");
    }

    const response = await this.app.getCompanyProfile({
      $,
      key: this.key,
      params,
    });

    const companyName = response?.header?.name ?? this.key;
    $.export("$summary", `Successfully retrieved hiring profile for: ${companyName}`);
    return response;
  },
};

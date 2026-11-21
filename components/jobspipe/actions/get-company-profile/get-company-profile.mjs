import app from "../../jobspipe.app.mjs";

export default {
  key: "jobspipe-get-company-profile",
  name: "Get Company Hiring Profile",
  description: "Get a company's hiring page showing how its hiring is changing (momentum, function mix, AI share, seniority), technology changes, corporate group, business facts, offices, similar companies, layoff notices, and monthly new/closed postings. [See the documentation](https://docs.jobspipe.dev/).",
  version: "0.0.2",
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
      description: "A company's `key` from the **Get Company** action (when a name is ambiguous, its 404 response lists candidates each with a `key` field), or a corporate group as `g-<LEI>`. Example: `3837186692681720328`.",
    },
    sections: {
      type: "string[]",
      label: "Sections",
      description: "Sections to return as an array of strings (e.g. `[\"header\", \"trends\"]`). Options: `header`, `trends`, `subsidiaries`, `tech_changes`, `facts`, `offices`, `peers`, `layoffs`, `hiring_monthly`. All sections are returned by default.",
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

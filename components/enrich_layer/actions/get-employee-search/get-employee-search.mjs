import enrichlayer from "../../enrich_layer.app.mjs";

export default {
  key: "enrich_layer-get-employee-search",
  name: "Get Employee Search",
  description: "Search employees of a target company by their job title. Cost: 10 credits per successful request + 3 credits per employee returned. [See the docs](https://enrichlayer.com/docs).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    enrichlayer,
    companyProfileUrl: {
      propDefinition: [
        enrichlayer,
        "companyProfileUrl",
      ],
      description: "The professional network URL of the target company.",
    },
    keywordBoolean: {
      type: "string",
      label: "Keyword (Boolean)",
      description: "Job title keyword to search for in Boolean Search Syntax (e.g., `ceo OR cto`). Max 255 characters. Takes precedence over Keyword Regex.",
    },
    keywordRegex: {
      type: "string",
      label: "Keyword (Regex) - Deprecated",
      description: "[DEPRECATED] Use Keyword Boolean instead. Job title keyword in regex format.",
      optional: true,
    },
    country: {
      propDefinition: [
        enrichlayer,
        "country",
      ],
      description: "Filter results by country. Costs an extra 3 credits per result.",
    },
    enrichProfiles: {
      propDefinition: [
        enrichlayer,
        "enrichProfiles",
      ],
    },
    pageSize: {
      propDefinition: [
        enrichlayer,
        "pageSize",
      ],
    },
    resolveNumericId: {
      type: "string",
      label: "Resolve Numeric ID",
      description: "Enable support for profile URLs with numerical IDs. Costs 2 extra credits.",
      optional: true,
      options: [
        {
          label: "False (default)",
          value: "false",
        },
        {
          label: "True (+2 credits)",
          value: "true",
        },
      ],
    },
  },
  async run({ $ }) {
    const response = await this.enrichlayer._makeRequest({
      $,
      path: "/api/v2/company/employee/search/",
      params: {
        company_profile_url: this.companyProfileUrl,
        keyword_boolean: this.keywordBoolean,
        keyword_regex: this.keywordRegex,
        country: this.country,
        enrich_profiles: this.enrichProfiles,
        page_size: this.pageSize,
        resolve_numeric_id: this.resolveNumericId,
      },
    });
    $.export("$summary", `Successfully searched employees at ${this.companyProfileUrl}`);
    return response;
  },
};

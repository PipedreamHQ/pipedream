import fastaf from "../../fastaf.app.mjs";

export default {
  key: "fastaf-search",
  name: "Search Web",
  description: "Retrieve one page of Google results with organic results and any available related sections. Costs 5 credits, or 10 for advanced search. [Documentation](https://fastaf.co/docs/#serp)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    fastaf,
    query: {
      propDefinition: [
        fastaf,
        "query",
      ],
    },
    results: {
      propDefinition: [
        fastaf,
        "results",
      ],
    },
    page: {
      propDefinition: [
        fastaf,
        "page",
      ],
    },
    country: {
      propDefinition: [
        fastaf,
        "country",
      ],
    },
    language: {
      propDefinition: [
        fastaf,
        "language",
      ],
    },
    domain: {
      propDefinition: [
        fastaf,
        "domain",
      ],
    },
    advanceSearch: {
      type: "boolean",
      label: "Advanced Search",
      description: "Include advanced snippets and features. Default false; true costs 10 rather than 5 credits. [Documentation](https://fastaf.co/docs/#serp)",
      optional: true,
      default: false,
    },
    mobile: {
      type: "boolean",
      label: "Mobile Results",
      description: "Request mobile rather than desktop results. Default false; no additional FastAF credits. [Documentation](https://fastaf.co/docs/#serp)",
      optional: true,
    },
    location: {
      type: "string",
      label: "Search Location",
      description: "City-level search origin, such as `Austin, Texas, United States`. Omit for the service default. [Documentation](https://fastaf.co/docs/#serp)",
      optional: true,
    },
  },
  async run({ $ }) {
    const { data } = await this.fastaf.search({
      $,
      data: {
        query: this.query,
        results: this.results,
        page: this.page,
        country: this.country,
        language: this.language,
        domain: this.domain,
        advance_search: this.advanceSearch,
        mob_search: this.mobile,
        location: this.location,
      },
    });
    $.export("$summary", `Successfully retrieved ${data.organic_results?.length ?? 0} organic results from one search page.`);
    return data;
  },
};

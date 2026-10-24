import fastaf from "../../fastaf.app.mjs";

export default {
  key: "fastaf-news",
  name: "Search News",
  description: "Retrieve one page of Google News results. Costs 5 credits. [Documentation](https://fastaf.co/docs/#news)",
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
    timeFilter: {
      type: "string",
      label: "Time Filter",
      description: "Google time expression, such as `qdr:d` for the past day or `qdr:w` for the past week. Omit for no explicit filter. [Documentation](https://fastaf.co/docs/#news)",
      optional: true,
    },
  },
  async run({ $ }) {
    const { data } = await this.fastaf.news({
      $,
      data: {
        query: this.query,
        results: this.results,
        page: this.page,
        country: this.country,
        language: this.language,
        domain: this.domain,
        tbs: this.timeFilter,
      },
    });
    $.export("$summary", `Successfully retrieved ${data.news_results?.length ?? 0} news results from one page.`);
    return data;
  },
};

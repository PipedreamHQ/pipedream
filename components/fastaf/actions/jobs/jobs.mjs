import fastaf from "../../fastaf.app.mjs";

export default {
  key: "fastaf-jobs",
  name: "Search Jobs",
  description: "Retrieve one page of Google Jobs listings. Costs 5 credits. [Documentation](https://fastaf.co/docs/#jobs)",
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
    nextPageToken: {
      type: "string",
      label: "Next Page Token",
      description: "Opaque token from the previous jobs response. Omit for the first page; keep the same query and filters. Each page costs 5 credits. [Documentation](https://fastaf.co/docs/#jobs)",
      optional: true,
    },
    chips: {
      type: "string",
      label: "Job Filters",
      description: "Filter expression copied from Google Jobs, such as `employment_type:FULLTIME`. Omit for no extra filters. [Documentation](https://fastaf.co/docs/#jobs)",
      optional: true,
    },
  },
  async run({ $ }) {
    const { data } = await this.fastaf.jobs({
      $,
      data: {
        query: this.query,
        country: this.country,
        language: this.language,
        domain: this.domain,
        next_page_token: this.nextPageToken,
        chips: this.chips,
      },
    });
    $.export("$summary", `Successfully retrieved ${data.jobs_results?.length ?? 0} job listings from one page.`);
    return data;
  },
};

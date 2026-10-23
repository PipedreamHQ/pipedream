import klussenbeheer from "../../klussenbeheer.app.mjs";

export default {
  key: "klussenbeheer-search-jobs",
  name: "Search Jobs",
  description: "Search jobs by title, customer name, address or phone number, newest first. Optionally filter by stage. [See the documentation](https://samdesk.nl/klussenbeheer/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  ai: "optimized",
  props: {
    klussenbeheer,
    searchTerm: {
      propDefinition: [
        klussenbeheer,
        "searchTerm",
      ],
      optional: true,
    },
    stage: {
      propDefinition: [
        klussenbeheer,
        "stage",
      ],
    },
    maxResults: {
      propDefinition: [
        klussenbeheer,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const jobs = await this.klussenbeheer.searchJobs($, {
      searchTerm: this.searchTerm,
      stage: this.stage,
      limit: this.maxResults,
    });

    $.export("$summary", `Found ${jobs.length} job${jobs.length === 1
      ? ""
      : "s"}`);

    return jobs;
  },
};

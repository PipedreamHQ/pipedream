import app from "../../search_api.app.mjs";

export default {
  key: "search_api-google-jobs",
  name: "Google Jobs API",
  description: "Search real-time Google Jobs listings. Returns a `jobs` array. Each page returns about 10 jobs; pass a previous run's `pagination.next_page_token` as **Next Page Token** for more. [See the documentation](https://www.searchapi.io/docs/google-jobs)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    app,
    q: {
      propDefinition: [
        app,
        "q",
      ],
      description: "The search query, e.g. `AI Engineer in New York`. Supports Google Jobs operators such as `remote customer service jobs` or `jobs from LinkedIn`.",
    },
    location: {
      propDefinition: [
        app,
        "location",
      ],
    },
    gl: {
      propDefinition: [
        app,
        "jobsGl",
      ],
    },
    hl: {
      propDefinition: [
        app,
        "hl",
      ],
    },
    nextPageToken: {
      propDefinition: [
        app,
        "nextPageToken",
      ],
    },
  },
  async run({ $ }) {
    const engine = "google_jobs";
    const params = {
      q: this.q,
      location: this.location,
      gl: this.gl,
      hl: this.hl,
      next_page_token: this.nextPageToken,
    };

    const result = await this.app.search({
      $,
      params,
      engine,
    });

    const count = result.jobs?.length || 0;
    $.export("$summary", `Successfully found ${count} job${count === 1
      ? ""
      : "s"} for "${this.q}"`);

    return result;
  },
};

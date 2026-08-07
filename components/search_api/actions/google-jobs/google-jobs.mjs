import app from "../../search_api.app.mjs";

export default {
  key: "search_api-google-jobs",
  name: "Google Jobs API",
  description: "Search real-time Google Jobs listings for a query, returning job details, apply links and detected attributes. Pass the `pagination.next_page_token` of a previous run as **Next Page Token** to page through results. [See the documentation](https://www.searchapi.io/docs/google-jobs)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
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

import app from "../../jobvetta.app.mjs";

export default {
  key: "jobvetta-search-jobs",
  name: "Search Jobs",
  description: "Search live verified employer career-site job postings by role keyword, location, remote status, and recency. [See the documentation](https://www.jobvetta.com/api)",
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
    q: {
      propDefinition: [
        app,
        "q",
      ],
    },
    location: {
      propDefinition: [
        app,
        "location",
      ],
    },
    remote: {
      propDefinition: [
        app,
        "remote",
      ],
    },
    days: {
      propDefinition: [
        app,
        "days",
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
    const response = await this.app.searchJobs({
      $,
      remote: this.remote,
      params: {
        q: this.q,
        location: this.location,
        days: this.days,
        limit: this.limit,
      },
    });
    const count = response.jobs?.length || 0;
    $.export("$summary", `Found ${count} job${count === 1
      ? ""
      : "s"} (${response.total || count} total matches)`);
    return response;
  },
};

import app from "../../lever_oauth.app.mjs";

export default {
  key: "lever_oauth-list-postings",
  name: "List Postings",
  description:
    "Returns job postings from Lever, optionally filtered by state, team, or location."
    + " Use this to discover posting IDs before searching opportunities with **Search Opportunities** or creating a new candidate with **Create Opportunity**."
    + " Returns each posting's id, name, state, team, department, and location."
    + " [See the documentation](https://hire.lever.co/developer/documentation#list-all-postings)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    state: {
      type: "string",
      label: "State",
      description: "Filter postings by state.",
      optional: true,
      options: [
        "published",
        "internal",
        "closed",
        "draft",
        "pending",
        "rejected",
      ],
    },
    team: {
      type: "string",
      label: "Team",
      description: "Filter by team name.",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "Filter by location.",
      optional: true,
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
      description: "Maximum number of postings to return (1–100). Defaults to 100.",
    },
  },
  async run({ $ }) {
    const response = await this.app.listPostings({
      $,
      params: {
        limit: this.limit,
        state: this.state,
        team: this.team,
        location: this.location,
      },
    });
    const postings = response.data ?? response;
    $.export("$summary", `Retrieved ${postings.length} posting${postings.length === 1
      ? ""
      : "s"}`);
    return postings;
  },
};

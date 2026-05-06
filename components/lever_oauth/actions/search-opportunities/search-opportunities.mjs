import app from "../../lever_oauth.app.mjs";

export default {
  key: "lever_oauth-search-opportunities",
  name: "Search Opportunities",
  description:
    "Searches and filters opportunities (candidate applications) in Lever."
    + " This is the primary tool for finding candidates — use it whenever asked to find, list, or filter candidates or applications."
    + " Supports filtering by job posting, pipeline stage, tag, origin, email, and archived status."
    + " Use **List Postings** to find posting IDs, **List Stages** to find stage IDs."
    + " When the user says 'my candidates', note that the API does not support filtering by owner directly — search by posting or stage and identify relevant records from the results."
    + " Set expand to include related objects inline (e.g. `stage`, `owner`, `contact`) and avoid follow-up calls."
    + " Returns cursor-paginated results; use the `next` field in the response to fetch subsequent pages."
    + " [See the documentation](https://hire.lever.co/developer/documentation#list-all-opportunities)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    postingId: {
      type: "string",
      label: "Posting ID",
      description: "Filter by job posting. Use **List Postings** to find posting IDs.",
      optional: true,
    },
    stageId: {
      type: "string",
      label: "Stage ID",
      description: "Filter by pipeline stage. Use **List Stages** to find stage IDs.",
      optional: true,
    },
    tag: {
      type: "string",
      label: "Tag",
      description: "Filter by a single tag applied to the opportunity.",
      optional: true,
    },
    origin: {
      type: "string",
      label: "Origin",
      description: "Filter by how the candidate entered the pipeline.",
      optional: true,
      options: [
        "agency",
        "applied",
        "internal",
        "referred",
        "university",
        "sourced",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "Filter by candidate email address.",
      optional: true,
    },
    archived: {
      type: "boolean",
      label: "Archived",
      description: "Set to `true` to return only archived opportunities, `false` for active only. Omit to return all.",
      optional: true,
    },
    expand: {
      type: "string[]",
      label: "Expand",
      description: "Inline related objects in the response to avoid follow-up calls. Options: `applications`, `stage`, `owner`, `followers`, `sourcedBy`, `contact`, `offers`.",
      optional: true,
      options: [
        "applications",
        "stage",
        "owner",
        "followers",
        "sourcedBy",
        "contact",
        "offers",
      ],
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of opportunities to return (1–100). Defaults to 100.",
      optional: true,
      default: 100,
    },
    offset: {
      type: "string",
      label: "Offset",
      description: "Cursor for pagination. Use the `next` value from a previous response to fetch the next page.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      limit: this.limit,
    };
    if (this.postingId) params.posting_id = this.postingId;
    if (this.stageId) params.stage_id = this.stageId;
    if (this.tag) params.tag = this.tag;
    if (this.origin) params.origin = this.origin;
    if (this.email) params.email = this.email;
    if (this.archived !== undefined) params.archived = this.archived;
    if (this.expand?.length) params.expand = this.expand.join(",");
    if (this.offset) params.offset = this.offset;

    const response = await this.app.listOpportunities({
      $,
      params,
    });
    const opportunities = response.data ?? response;
    $.export("$summary", `Found ${opportunities.length} opportunit${opportunities.length === 1
      ? "y"
      : "ies"}`);
    return response;
  },
};

import app from "../../lever.app.mjs";

export default {
  key: "lever-search-opportunities",
  name: "Search Opportunities",
  description:
    "Searches and filters opportunities (candidate applications) in Lever."
    + " This is the primary tool for finding candidates — use it whenever asked to find, list, or filter candidates or applications."
    + " Supports filtering by job posting, pipeline stage, tag, origin, email, and archived status."
    + " Use **List Postings** to find posting IDs, **List Stages** to find stage IDs."
    + " The Lever API has no name or owner filter. To find a candidate **by name**, pass the name in `email`: when the value isn't a valid email address this tool lists opportunities and matches them by name/email locally (it does not send an invalid `email` to the API)."
    + " When the user says 'my candidates', note that the API does not support filtering by owner directly — search by posting or stage and identify relevant records from the results."
    + " Set expand to include related objects inline (e.g. `stage`, `owner`, `contact`) and avoid follow-up calls."
    + " Returns cursor-paginated results; use the `next` field in the response to fetch subsequent pages."
    + " Example: to find a candidate by email, call with email=\"jane@example.com\" → exact match; to find by name, call with email=\"Jane Doe\" → local name match."
    + " [See the documentation](https://hire.lever.co/developer/documentation#list-all-opportunities)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    postingId: {
      propDefinition: [
        app,
        "postingId",
      ],
      description: "Filter by job posting. Use **List Postings** to find posting IDs.",
    },
    stageId: {
      propDefinition: [
        app,
        "stageId",
      ],
      description: "Filter by pipeline stage. Use **List Stages** to find stage IDs.",
    },
    tag: {
      type: "string",
      label: "Tag",
      description: "Filter by a single tag applied to the opportunity.",
      optional: true,
    },
    origin: {
      propDefinition: [
        app,
        "origin",
      ],
      description: "Filter by how the candidate entered the pipeline.",
    },
    email: {
      type: "string",
      label: "Email or name",
      description: "Find a candidate. Pass a full email address for an exact server-side match. The Lever API has no name search, so if you pass a name or partial here instead, this tool lists opportunities and matches them by name/email locally rather than sending an invalid address to the API.",
      optional: true,
    },
    archived: {
      type: "boolean",
      label: "Archived",
      description: "Set to `true` to return only archived opportunities, `false` for active only. Omit to return all.",
      optional: true,
    },
    expand: {
      propDefinition: [
        app,
        "expand",
      ],
      description: "Inline related objects in the response to avoid follow-up calls. Options: `applications`, `stage`, `owner`, `followers`, `sourcedBy`, `contact`.",
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
      description: "Maximum number of opportunities to return (1–100). Defaults to 100.",
    },
    offset: {
      propDefinition: [
        app,
        "offset",
      ],
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
    if (this.archived !== undefined) params.archived = this.archived;
    if (this.expand?.length) params.expand = this.expand;
    if (this.offset) params.offset = this.offset;

    // Lever's `email` filter is an exact match and 400s ("Email address is not
    // valid") on anything that isn't a real address. The API has no name filter,
    // so when asked to find a candidate by name the only path is list-then-filter.
    // If `email` isn't a valid address, treat it as a name/keyword query: omit it
    // server-side and match locally on name/email, instead of letting Lever reject it.
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameQuery = this.email && !EMAIL_RE.test(this.email)
      ? this.email.trim().toLowerCase()
      : null;
    if (this.email && !nameQuery) params.email = this.email;

    const response = await this.app.listOpportunities({
      $,
      params,
    });

    let opportunities = response.data ?? response;
    if (nameQuery && Array.isArray(opportunities)) {
      opportunities = opportunities.filter((o) => {
        const name = (o.name ?? "").toLowerCase();
        const emails = (o.emails ?? []).join(" ").toLowerCase();
        return name.includes(nameQuery) || emails.includes(nameQuery);
      });
    }

    const count = Array.isArray(opportunities)
      ? opportunities.length
      : undefined;
    $.export("$summary", nameQuery
      ? `Found ${count} opportunit${count === 1
        ? "y"
        : "ies"} matching "${this.email}"`
      : `Found ${count} opportunit${count === 1
        ? "y"
        : "ies"}`);

    // For a local name match, return the filtered set in Lever's response envelope
    // (preserving `next`/pagination fields) so downstream sees only relevant records.
    if (nameQuery) {
      return response && typeof response === "object" && Array.isArray(response.data)
        ? {
          ...response,
          data: opportunities,
        }
        : opportunities;
    }
    return response;
  },
};

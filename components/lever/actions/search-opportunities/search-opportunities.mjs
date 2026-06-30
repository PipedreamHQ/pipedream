import app from "../../lever.app.mjs";

export default {
  key: "lever-search-opportunities",
  name: "Search Opportunities",
  description:
    "Searches and filters opportunities (candidate applications) in Lever."
    + " This is the primary tool for finding candidates — use it whenever asked to find, list, or filter candidates or applications."
    + " Supports filtering by job posting, pipeline stage, tag, origin, email, and archived status."
    + " Use **List Postings** to find posting IDs, **List Stages** to find stage IDs."
    + " The Lever API has no name or owner filter. To find a candidate **by name**, pass the name in `email`: when the value isn't a valid email address this tool lists opportunities and matches them by name/email locally (it does not send an invalid `email` to the API). The local name match sweeps up to the first several pages of results; if that cap is reached the `$summary` says so and the response `next` cursor lets you continue."
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
    const email = this.email?.trim();
    const nameQuery = email && !EMAIL_RE.test(email)
      ? email.toLowerCase()
      : null;
    if (email && !nameQuery) params.email = email;

    const response = await this.app.listOpportunities({
      $,
      params,
    });

    // No name query: return Lever's response (single page) as-is.
    if (!nameQuery) {
      const data = response.data ?? response;
      const total = Array.isArray(data)
        ? data.length
        : undefined;
      $.export("$summary", `Found ${total} opportunit${total === 1
        ? "y"
        : "ies"}`);
      return response;
    }

    // Name query: Lever has no server-side name filter, so sweep across pages and
    // match locally. Bound the sweep with a page cap to avoid timeouts / excessive
    // calls on very large accounts; surface in the summary when the cap is hit.
    const MAX_PAGES = 10;
    const matchesNameQuery = (o) => {
      const name = (o.name ?? "").toLowerCase();
      const emails = (o.emails ?? []).join(" ").toLowerCase();
      return name.includes(nameQuery) || emails.includes(nameQuery);
    };

    const matches = [];
    let scanned = 0;
    let pages = 0;
    let current = response;
    let continuation;
    for (;;) {
      const data = current.data ?? current;
      if (Array.isArray(data)) {
        scanned += data.length;
        matches.push(...data.filter(matchesNameQuery));
      }
      pages += 1;
      const next = Array.isArray(data)
        ? current.next
        : undefined;
      if (!next) break;
      if (pages >= MAX_PAGES) {
        continuation = next;
        break;
      }
      current = await this.app.listOpportunities({
        $,
        params: {
          ...params,
          offset: next,
        },
      });
    }

    const count = matches.length;
    $.export("$summary", `Found ${count} opportunit${count === 1
      ? "y"
      : "ies"} matching "${email}" (searched ${scanned} record${scanned === 1
      ? ""
      : "s"}${continuation
      ? `; stopped at ${MAX_PAGES}-page cap, more may exist`
      : ""})`);

    // Return the aggregated matches in Lever's response envelope. `next` reflects
    // the real continuation cursor: the unfetched page when capped, otherwise none.
    if (response && typeof response === "object" && Array.isArray(response.data)) {
      return {
        ...response,
        data: matches,
        next: continuation,
        hasNext: Boolean(continuation),
      };
    }
    return matches;
  },
};

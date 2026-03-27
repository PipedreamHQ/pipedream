// vandelay-test-dr
import app from "../../app/beehiiv.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  key: "beehiiv-search-subscribers",
  name: "Search Subscribers",
  description:
    "Search and filter subscribers for a publication."
    + " Use `email` for exact email lookup, or combine `status`"
    + " and `tier` filters to narrow results."
    + " Use **Get Publication Info** to get the publication ID."
    + " For full details on a single subscriber (with stats,"
    + " custom fields, referrals), use **Get Subscriber** instead."
    + " Use **List Custom Fields** to discover available custom"
    + " field names."
    + " [See the documentation]"
    + "(https://developers.beehiiv.com/api-reference/"
    + "subscriptions/index)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    publicationId: {
      type: "string",
      label: "Publication ID",
      description:
        "The publication ID. Use **Get Publication Info** to find"
        + " this.",
    },
    email: {
      type: "string",
      label: "Email",
      description:
        "Filter by exact email address (case-insensitive).",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description:
        "Filter by subscription status. Options: `validating`,"
        + " `invalid`, `pending`, `active`, `inactive`, `all`."
        + " Default: `all`.",
      optional: true,
      options: [
        "validating",
        "invalid",
        "pending",
        "active",
        "inactive",
        "all",
      ],
    },
    tier: {
      type: "string",
      label: "Tier",
      description:
        "Filter by subscription tier. Options: `free`, `premium`,"
        + " `all`. Default: `all`.",
      optional: true,
      options: [
        "free",
        "premium",
        "all",
      ],
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Number of results per page (1-100). Default: 10.",
      optional: true,
    },
    cursor: {
      type: "string",
      label: "Cursor",
      description:
        "Pagination cursor from a previous response for the next"
        + " page of results.",
      optional: true,
    },
    expand: {
      type: "string[]",
      label: "Expand",
      description:
        "Include additional data for each subscriber."
        + " Options: `stats`, `custom_fields`, `referrals`,"
        + " `subscription_premium_tiers`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params: Record<string, unknown> = {};
    if (this.email) params.email = this.email;
    if (this.status) params.status = this.status;
    if (this.tier) params.tier = this.tier;
    if (this.limit) params.limit = this.limit;
    if (this.cursor) params.cursor = this.cursor;
    if (this.expand?.length) params["expand[]"] = this.expand;

    const response = await this.app.listSubscriptions(
      $,
      this.publicationId,
      params,
    );

    const subscribers = response.data || [];
    const total = response.total_results || subscribers.length;

    $.export(
      "$summary",
      `Found ${total} subscriber${total === 1
        ? ""
        : "s"}, returning ${subscribers.length}`,
    );

    return response;
  },
});

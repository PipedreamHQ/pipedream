import luma from "../../luma.app.mjs";
import {
  collectPaginatedResults,
  extractEntries,
} from "../../common/utils.mjs";

export default {
  key: "luma-list-events",
  name: "List Events",
  description: "List events managed by the connected Luma calendar. Use this to find event IDs for **Get Event**, **Get Guests**, **Add Guests**, or **Send Invites**. This only returns events managed by the calendar, not external events merely listed on it. [See the documentation](https://docs.luma.com/reference/get_v1-calendar-list-events)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    luma,
    after: {
      type: "string",
      label: "After",
      description: "Return events starting after this ISO 8601 datetime, for example `2026-05-01T00:00:00Z`.",
      optional: true,
    },
    before: {
      type: "string",
      label: "Before",
      description: "Return events starting before this ISO 8601 datetime, for example `2026-06-01T00:00:00Z`.",
      optional: true,
    },
    paginationCursor: {
      propDefinition: [
        luma,
        "paginationCursor",
      ],
    },
    paginationLimit: {
      propDefinition: [
        luma,
        "paginationLimit",
      ],
    },
    platforms: {
      type: "string[]",
      label: "Platforms",
      description: "Event platforms to include. Defaults to `luma`; pass both `luma` and `external` to include external events.",
      optional: true,
      options: [
        "luma",
        "external",
      ],
    },
    status: {
      type: "string",
      label: "Status",
      description: "Calendar submission status to include. Luma defaults to `approved`.",
      optional: true,
      options: [
        "approved",
        "pending",
      ],
    },
    sortColumn: {
      type: "string",
      label: "Sort Column",
      description: "The column to sort by. Luma currently supports `start_at`.",
      optional: true,
      options: [
        "start_at",
      ],
    },
    sortDirection: {
      propDefinition: [
        luma,
        "sortDirection",
      ],
    },
    fetchAll: {
      type: "boolean",
      label: "Fetch All Pages",
      description: "When enabled, keep following `next_cursor` until there are no more pages or Max Pages is reached.",
      optional: true,
      default: false,
    },
    maxPages: {
      propDefinition: [
        luma,
        "maxPages",
      ],
    },
  },
  methods: {
    getParams(paginationCursor = this.paginationCursor) {
      return {
        after: this.after,
        before: this.before,
        pagination_cursor: paginationCursor,
        pagination_limit: this.paginationLimit,
        platforms: this.platforms,
        status: this.status,
        sort_column: this.sortColumn,
        sort_direction: this.sortDirection,
      };
    },
  },
  async run({ $ }) {
    if (this.fetchAll) {
      const {
        results,
        pageCount,
        hasMore,
      } = await collectPaginatedResults({
        requestPage: (paginationCursor) => this.luma.listEvents({
          $,
          params: this.getParams(paginationCursor),
        }),
        responseKey: "event",
        initialCursor: this.paginationCursor,
        maxPages: this.maxPages,
      });

      $.export("$summary", `Retrieved ${results.length} events across ${pageCount} pages${hasMore
        ? "; more pages remain"
        : ""}`);
      return results;
    }

    const response = await this.luma.listEvents({
      $,
      params: this.getParams(),
    });
    const events = extractEntries(response, "event");

    $.export("$summary", `Retrieved ${events.length} events`);
    return response;
  },
};

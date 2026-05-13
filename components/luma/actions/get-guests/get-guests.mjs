import luma from "../../luma.app.mjs";
import {
  collectPaginatedResults,
  extractEntries,
} from "../../common/utils.mjs";

export default {
  key: "luma-get-guests",
  name: "Get Guests",
  description: "List guests who registered for, were invited to, or are waitlisted for a Luma event. Omit Approval Status to include all guest statuses. Use **List Events** first if you need to find the event ID. [See the documentation](https://docs.luma.com/reference/get_v1-event-get-guests)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    luma,
    eventId: {
      propDefinition: [
        luma,
        "eventId",
      ],
    },
    approvalStatus: {
      type: "string",
      label: "Approval Status",
      description: "Filter guests by approval status. Leave blank to return all statuses.",
      optional: true,
      options: [
        "approved",
        "session",
        "pending_approval",
        "invited",
        "declined",
        "waitlist",
      ],
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
    sortColumn: {
      type: "string",
      label: "Sort Column",
      description: "The guest field to sort by.",
      optional: true,
      options: [
        "name",
        "email",
        "created_at",
        "registered_at",
        "checked_in_at",
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
        event_id: this.eventId,
        approval_status: this.approvalStatus,
        pagination_cursor: paginationCursor,
        pagination_limit: this.paginationLimit,
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
        requestPage: (paginationCursor) => this.luma.getGuests({
          $,
          params: this.getParams(paginationCursor),
        }),
        responseKey: "guest",
        initialCursor: this.paginationCursor,
        maxPages: this.maxPages,
      });

      $.export("$summary", `Retrieved ${results.length} guests across ${pageCount} pages${hasMore
        ? "; more pages remain"
        : ""}`);
      return results;
    }

    const response = await this.luma.getGuests({
      $,
      params: this.getParams(),
    });
    const guests = extractEntries(response, "guest");

    $.export("$summary", `Retrieved ${guests.length} guests`);
    return response;
  },
};

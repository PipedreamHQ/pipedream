import docusign from "../../docusign.app.mjs";
import {
  ENVELOPE_STATUS_OPTIONS,
  getDefaultFromDate,
} from "../common/utils.mjs";

export default {
  key: "docusign-list-envelopes",
  name: "List Envelopes",
  description: "Search for DocuSign envelopes by date, status, email, text, or folder filters. Use this to find envelope IDs for **Get Envelope**, **List Recipients**, **List Documents**, **Send Envelope**, **Void Envelope**, or **Create Recipient View**. [See the documentation](https://developers.docusign.com/docs/esign-rest-api/reference/envelopes/envelopes/liststatuschanges/)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    docusign,
    account: {
      propDefinition: [
        docusign,
        "account",
      ],
    },
    fromDate: {
      type: "string",
      label: "From Date",
      description: "Return envelopes changed on or after this ISO 8601 datetime, for example `2026-04-01T00:00:00Z`. Defaults to 30 days ago.",
      optional: true,
    },
    toDate: {
      type: "string",
      label: "To Date",
      description: "Return envelopes changed on or before this ISO 8601 datetime, for example `2026-04-30T23:59:59Z`.",
      optional: true,
    },
    status: {
      type: "string[]",
      label: "Status",
      description: "Envelope statuses to include.",
      optional: true,
      options: ENVELOPE_STATUS_OPTIONS,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Filter by recipient or sender email address.",
      optional: true,
    },
    searchText: {
      type: "string",
      label: "Search Text",
      description: "Search text matched against envelope metadata.",
      optional: true,
    },
    folderIds: {
      type: "string[]",
      label: "Folder IDs",
      description: "Filter by one or more folder IDs.",
      optional: true,
    },
    count: {
      type: "integer",
      label: "Count",
      description: "Number of envelopes to request per page.",
      optional: true,
      default: 100,
      min: 1,
    },
    startPosition: {
      type: "integer",
      label: "Start Position",
      description: "Zero-based result offset for the first page.",
      optional: true,
      default: 0,
      min: 0,
    },
    order: {
      type: "string",
      label: "Order",
      description: "Sort order.",
      optional: true,
      options: [
        "asc",
        "desc",
      ],
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "Field to sort by.",
      optional: true,
      options: [
        "action_required",
        "created",
        "completed",
        "sent",
        "signer_list",
        "status",
        "subject",
        "last_modified",
      ],
    },
    fetchAll: {
      type: "boolean",
      label: "Fetch All Pages",
      description: "When enabled, follow pagination until no pages remain or Max Pages is reached.",
      optional: true,
      default: false,
    },
    maxPages: {
      type: "integer",
      label: "Max Pages",
      description: "Maximum pages to retrieve when Fetch All Pages is enabled.",
      optional: true,
      default: 10,
      min: 1,
    },
  },
  methods: {
    getParams(startPosition = this.startPosition) {
      return {
        from_date: this.fromDate || getDefaultFromDate(),
        to_date: this.toDate,
        status: this.status?.join(","),
        email: this.email,
        search_text: this.searchText,
        folder_ids: this.folderIds?.join(","),
        count: this.count,
        start_position: startPosition,
        order: this.order,
        order_by: this.orderBy,
      };
    },
  },
  async run({ $ }) {
    const baseUri = await this.docusign.getBaseUri({
      $,
      accountId: this.account,
    });

    if (this.fetchAll) {
      const envelopes = [];
      let startPosition = this.startPosition;
      let pages = 0;
      let hasMore = false;

      do {
        const response = await this.docusign.listEnvelopes({
          $,
          baseUri,
          params: this.getParams(startPosition),
        });
        envelopes.push(...response.envelopes ?? []);
        hasMore = Boolean(response.nextUri);
        startPosition = response.endPosition
          ? Number(response.endPosition) + 1
          : startPosition + this.count;
        pages++;
      } while (hasMore && pages < this.maxPages);

      $.export("$summary", `Retrieved ${envelopes.length} envelopes across ${pages} pages${hasMore
        ? "; more pages remain"
        : ""}`);
      return envelopes;
    }

    const response = await this.docusign.listEnvelopes({
      $,
      baseUri,
      params: this.getParams(),
    });
    const envelopes = response.envelopes ?? [];

    $.export("$summary", `Retrieved ${envelopes.length} envelopes`);
    return response;
  },
};

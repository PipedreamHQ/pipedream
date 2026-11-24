import firma from "../../firma.app.mjs";
import {
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  SIGNING_REQUEST_SORT_FIELDS,
  SIGNING_REQUEST_STATUSES,
  SORT_ORDERS,
} from "../../common/constants.mjs";

export default {
  key: "firma-list-signing-requests",
  name: "List Signing Requests",
  description: "Lists Firma signing requests with their status and recipients, filtered by status, name, signer or creation date. Returns one page: `results` plus `pagination` (`current_page`, `page_size`, `total_count`, `total_pages`); set **Page** to read further pages. **Page Size** is at most 200. Use it to find a request ID for **Get Signing Request**, **Download Signed Document**, **Cancel Signing Request** or **Resend Signing Request**. [See the documentation](https://docs.firma.dev/api-reference/signing-requests/list-signing-requests)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    firma,
    status: {
      type: "string[]",
      label: "Status",
      description: "Only return requests with one of these statuses, for example `[\"in_progress\", \"expired\"]`. Deleted requests are included with status `deleted` unless **Exclude Deleted** is `true`.",
      optional: true,
      options: SIGNING_REQUEST_STATUSES,
    },
    excludeDeleted: {
      type: "boolean",
      label: "Exclude Deleted",
      description: "When `true`, deleted requests are left out of the results.",
      optional: true,
      default: false,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Only return requests whose name contains this text (case-insensitive), for example `contract`.",
      optional: true,
    },
    signerEmail: {
      type: "string",
      label: "Signer Email",
      description: "Only return requests with a recipient whose email contains this text (case-insensitive), for example `jane@example.com`.",
      optional: true,
    },
    signerName: {
      type: "string",
      label: "Signer Name",
      description: "Only return requests with a recipient whose name contains this text (case-insensitive), for example `Jane`.",
      optional: true,
    },
    createdAfter: {
      type: "string",
      label: "Created After",
      description: "Only return requests created after this ISO 8601 date-time, for example `2026-01-31T00:00:00Z`.",
      optional: true,
    },
    createdBefore: {
      type: "string",
      label: "Created Before",
      description: "Only return requests created before this ISO 8601 date-time, for example `2026-02-28T23:59:59Z`.",
      optional: true,
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "The field to sort by.",
      optional: true,
      options: SIGNING_REQUEST_SORT_FIELDS,
      default: "created_on",
    },
    sortOrder: {
      type: "string",
      label: "Sort Order",
      description: "The sort direction.",
      optional: true,
      options: SORT_ORDERS,
      default: "desc",
    },
    page: {
      type: "integer",
      label: "Page",
      description: "The page to return, starting at 1.",
      optional: true,
      default: 1,
      min: 1,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "Requests per page, from 1 to 200.",
      optional: true,
      default: DEFAULT_PAGE_SIZE,
      min: 1,
      max: MAX_PAGE_SIZE,
    },
  },
  async run({ $ }) {
    const response = await this.firma.listSigningRequests({
      $,
      params: {
        status: Array.isArray(this.status)
          ? this.status.join(",") || undefined
          : this.status,
        exclude_deleted: this.excludeDeleted || undefined,
        name: this.name,
        signer_email: this.signerEmail,
        signer_name: this.signerName,
        created_after: this.createdAfter,
        created_before: this.createdBefore,
        sort_by: this.sortBy,
        sort_order: this.sortOrder,
        page: this.page,
        page_size: this.pageSize,
      },
    });
    const count = response.results?.length ?? 0;
    const total = response.pagination?.total_count;
    $.export("$summary", `Retrieved ${count} signing request(s)${total === undefined
      ? ""
      : ` of ${total}`}`);
    return response;
  },
};

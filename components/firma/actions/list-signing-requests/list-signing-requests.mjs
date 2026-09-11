import firma from "../../firma.app.mjs";
import {
  SIGNING_REQUEST_STATUSES,
  SIGNING_REQUEST_SORT_FIELDS,
  SORT_ORDERS,
} from "../../common/constants.mjs";

export default {
  key: "firma-list-signing-requests",
  name: "List Signing Requests",
  description: "Retrieves a paginated list of signing requests. [See the documentation](https://docs.firma.dev/api-reference/signing-requests/list-signing-requests)",
  version: "0.0.1",
  type: "action",
  props: {
    firma,
    status: {
      type: "string",
      label: "Status",
      description: "Filter by signing request status",
      optional: true,
      options: SIGNING_REQUEST_STATUSES,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Filter by name (partial match, case-insensitive)",
      optional: true,
    },
    signerEmail: {
      type: "string",
      label: "Signer Email",
      description: "Filter by signer email address (exact match)",
      optional: true,
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "Field to sort by",
      optional: true,
      options: SIGNING_REQUEST_SORT_FIELDS,
    },
    sortOrder: {
      type: "string",
      label: "Sort Order",
      description: "Sort order",
      optional: true,
      options: SORT_ORDERS,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number",
      optional: true,
      default: 1,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "Items per page (max 200)",
      optional: true,
      default: 50,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.status) params.status = this.status;
    if (this.name) params.name = this.name;
    if (this.signerEmail) params.signer_email = this.signerEmail;
    if (this.sortBy) params.sort_by = this.sortBy;
    if (this.sortOrder) params.sort_order = this.sortOrder;
    if (this.page) params.page = this.page;
    if (this.pageSize) params.page_size = this.pageSize;
    const response = await this.firma.listSigningRequests({
      $,
      params,
    });
    $.export("$summary", `Successfully retrieved ${response.results?.length || 0} signing request(s)`);
    return response;
  },
};

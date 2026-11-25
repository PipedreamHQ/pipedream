import paymos, { PAYMOS_INVOICE_STATUSES } from "../../paymos.app.mjs";

export default {
  key: "paymos-list-invoices",
  name: "List Invoices",
  description: "List Paymos invoices with optional filters and keyset cursor pagination. [See the documentation](https://paymos.io/docs)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    paymos,
    projectId: {
      propDefinition: [
        paymos,
        "projectId",
      ],
      optional: true,
    },
    status: {
      type: "string[]",
      label: "Status",
      description: "Optional list of invoice statuses to filter by.",
      optional: true,
      options: [
        ...PAYMOS_INVOICE_STATUSES,
      ],
    },
    externalOrderId: {
      type: "string",
      label: "External Order ID",
      description: "Optional exact merchant external order identifier filter.",
      optional: true,
    },
    createdFrom: {
      type: "integer",
      label: "Created From (Unix Seconds)",
      description: "Optional inclusive lower bound as a Unix timestamp in seconds.",
      optional: true,
      min: 0,
    },
    createdTo: {
      type: "integer",
      label: "Created To (Unix Seconds)",
      description: "Optional exclusive upper bound as a Unix timestamp in seconds.",
      optional: true,
      min: 0,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of invoices to return (`1` to `100`, default `20`).",
      optional: true,
      min: 1,
      max: 100,
    },
    cursor: {
      type: "string",
      label: "Cursor",
      description: "Optional opaque pagination cursor returned as `next_cursor` by a previous page.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.paymos.listInvoices({
      projectId: this.projectId,
      status: this.status,
      externalOrderId: this.externalOrderId,
      createdFrom: this.createdFrom,
      createdTo: this.createdTo,
      limit: this.limit,
      cursor: this.cursor,
    });
    const count = Array.isArray(response?.items) ? response.items.length : 0;
    $.export("$summary", `Successfully retrieved ${count} invoice${count === 1 ? "" : "s"}`);
    return response;
  },
};

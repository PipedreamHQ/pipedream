import harvest from "../../harvest.app.mjs";

export default {
  key: "harvest-update-invoice",
  name: "Update Invoice",
  description: "Update an existing invoice. Use **List Invoices** to find a valid ID. Example: call with invoiceId set to a draft invoice's ID and subject set to a new value to revise it before sending. [See the documentation](https://help.getharvest.com/api-v2/invoices-api/invoices/invoices/#update-an-invoice).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    harvest,
    accountId: {
      propDefinition: [
        harvest,
        "accountId",
      ],
    },
    invoiceId: {
      propDefinition: [
        harvest,
        "invoiceId",
      ],
    },
    clientId: {
      propDefinition: [
        harvest,
        "clientId",
      ],
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The invoice subject.",
      optional: true,
    },
    number: {
      type: "string",
      label: "Number",
      description: "The invoice number.",
      optional: true,
    },
    purchaseOrder: {
      type: "string",
      label: "Purchase Order",
      description: "The purchase order number.",
      optional: true,
    },
    tax: {
      type: "string",
      label: "Tax",
      description: "First tax rate percentage, decimal.",
      optional: true,
    },
    discount: {
      type: "string",
      label: "Discount",
      description: "Discount percentage, decimal.",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Notes about the invoice.",
      optional: true,
    },
    issueDate: {
      type: "string",
      label: "Issue Date",
      description: "Issue date, `YYYY-MM-DD`.",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "Due date, `YYYY-MM-DD`.",
      optional: true,
    },
    lineItems: {
      type: "string",
      label: "Line Items",
      description: "JSON array of line item objects. Omit `id` to add a new line item, e.g. `[{\"kind\":\"Service\",\"description\":\"Consulting\",\"unit_price\":100,\"quantity\":5}]`. Include an existing line item's `id` (from the invoice's `line_items` in a prior response, e.g. from **Get Invoice**) plus any fields to change, e.g. `[{\"id\":53341928,\"description\":\"Consulting Phase 2\",\"unit_price\":150}]`, to update it. Include that `id` with `_destroy` set to `true`, e.g. `[{\"id\":53341928,\"_destroy\":true}]`, to delete it.",
      optional: true,
    },
  },
  async run({ $ }) {
    const lineItems = this.lineItems
      ? JSON.parse(this.lineItems)
      : undefined;
    const response = await this.harvest.updateInvoice({
      $,
      invoiceId: this.invoiceId,
      accountId: this.accountId,
      data: {
        client_id: this.clientId,
        subject: this.subject,
        number: this.number,
        purchase_order: this.purchaseOrder,
        tax: this.tax,
        discount: this.discount,
        notes: this.notes,
        issue_date: this.issueDate,
        due_date: this.dueDate,
        line_items: lineItems,
      },
    });
    $.export("$summary", `Successfully updated invoice ${response.id}`);
    return response;
  },
};

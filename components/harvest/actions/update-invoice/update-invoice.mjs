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
      propDefinition: [
        harvest,
        "subject",
      ],
    },
    number: {
      propDefinition: [
        harvest,
        "invoiceNumber",
      ],
    },
    purchaseOrder: {
      propDefinition: [
        harvest,
        "purchaseOrder",
      ],
    },
    tax: {
      propDefinition: [
        harvest,
        "tax",
      ],
    },
    discount: {
      propDefinition: [
        harvest,
        "discount",
      ],
    },
    notes: {
      propDefinition: [
        harvest,
        "invoiceNotes",
      ],
    },
    issueDate: {
      propDefinition: [
        harvest,
        "issueDate",
      ],
    },
    dueDate: {
      propDefinition: [
        harvest,
        "dueDate",
      ],
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

import harvest from "../../harvest.app.mjs";

export default {
  key: "harvest-create-invoice",
  name: "Create Invoice",
  description: "Create a new free-form invoice for a client. Provide Line Items as a JSON array to itemize the invoice. Example: call with clientId set to InGen Corp's client ID, subject=\"Consulting Services\", lineItems=`[{\"kind\":\"Service\",\"description\":\"Genetics consulting\",\"unit_price\":2000,\"quantity\":1}]`. [See the documentation](https://help.getharvest.com/api-v2/invoices-api/invoices/invoices/#create-a-free-form-invoice).",
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
    clientId: {
      propDefinition: [
        harvest,
        "clientId",
      ],
      optional: false,
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
      description: "The invoice number. Defaults to the next sequential number.",
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
    currency: {
      type: "string",
      label: "Currency",
      description: "The currency code, e.g. `USD`.",
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
      description: "Due date, `YYYY-MM-DD`, e.g. `2026-09-30`.",
      optional: true,
    },
    lineItems: {
      type: "string",
      label: "Line Items",
      description: "JSON array of line item objects. Example: `[{\"kind\":\"Service\",\"description\":\"Consulting\",\"unit_price\":100,\"quantity\":5}]`. Each item requires `kind` and `unit_price`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const lineItems = this.lineItems
      ? JSON.parse(this.lineItems)
      : undefined;
    const response = await this.harvest.createInvoice({
      $,
      accountId: this.accountId,
      data: {
        client_id: this.clientId,
        subject: this.subject,
        number: this.number,
        purchase_order: this.purchaseOrder,
        tax: this.tax,
        discount: this.discount,
        notes: this.notes,
        currency: this.currency,
        issue_date: this.issueDate,
        due_date: this.dueDate,
        line_items: lineItems,
      },
    });
    $.export("$summary", `Successfully created invoice ${response.id}`);
    return response;
  },
};

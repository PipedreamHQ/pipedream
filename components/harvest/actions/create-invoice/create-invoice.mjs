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
      description: "The invoice number, e.g. `1000`. Defaults to the next sequential number if omitted.",
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
    currency: {
      type: "string",
      label: "Currency",
      description: "The currency code, e.g. `USD`.",
      optional: true,
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

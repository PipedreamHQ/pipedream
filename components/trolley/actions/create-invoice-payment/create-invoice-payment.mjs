import trolley from "../../trolley.app.mjs";

export default {
  key: "trolley-create-invoice-payment",
  name: "Create Invoice Payment",
  description: "Create a payment against one or more invoices or invoice lines, optionally adding it to a batch. [See the documentation](https://developers.trolley.com/api/#create-an-invoice-payment)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    trolley,
    invoiceId: {
      propDefinition: [
        trolley,
        "invoiceId",
      ],
      description: "The invoice ID to pay (e.g., `I-xxxx`). Either **Invoice ID** or **Invoice Line ID** must be provided.",
      optional: true,
    },
    invoiceLineId: {
      type: "string",
      label: "Invoice Line ID",
      description: "The invoice line ID to pay (e.g., `IL-xxxx`). Either **Invoice ID** or **Invoice Line ID** must be provided.",
      optional: true,
    },
    amountValue: {
      type: "string",
      label: "Amount Value",
      description: "Amount to pay as a decimal string (e.g., `200.00`). If provided, **Amount Currency** is also required.",
      optional: true,
    },
    amountCurrency: {
      propDefinition: [
        trolley,
        "currency",
      ],
      label: "Amount Currency",
      description: "ISO 4217 currency code matching the invoice's currency (e.g., `USD`).",
      optional: true,
    },
    batchId: {
      propDefinition: [
        trolley,
        "batchId",
      ],
      description: "The batch to add this payment to (e.g., `B-xxxx`). If omitted, Trolley will handle batching.",
      optional: true,
    },
    memo: {
      propDefinition: [
        trolley,
        "memo",
      ],
      description: "A memo for the payment. Visible to the recipient. Max 1024 characters.",
      optional: true,
    },
    externalId: {
      propDefinition: [
        trolley,
        "externalId",
      ],
      description: "External ID to assign to the payment.",
      optional: true,
    },
    tags: {
      propDefinition: [
        trolley,
        "tags",
      ],
      description: "Tags to attach to the payment.",
      optional: true,
    },
    coverFees: {
      propDefinition: [
        trolley,
        "coverFees",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const amount = this.amountValue !== undefined || this.amountCurrency !== undefined
      ? {
        value: this.amountValue,
        currency: this.amountCurrency,
      }
      : undefined;

    const response = await this.trolley.createInvoicePayment({
      $,
      data: {
        batchId: this.batchId,
        memo: this.memo,
        externalId: this.externalId,
        tags: this.tags,
        coverFees: this.coverFees,
        ids: [
          {
            invoiceId: this.invoiceId,
            invoiceLineId: this.invoiceLineId,
            amount,
          },
        ],
      },
    });
    $.export("$summary", `Successfully created invoice payment for ${this.invoiceLineId || this.invoiceId}`);
    return response;
  },
};

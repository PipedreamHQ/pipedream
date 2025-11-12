import chaser from "../../chaser.app.mjs";

export default {
  key: "chaser-create-invoice",
  name: "Create Invoice",
  description: "Creates a new invoice in Chaser. [See the documentation](https://openapi.chaserhq.com/docs/static/index.html)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    chaser,
    invoiceId: {
      type: "string",
      label: "Invoice ID",
      description: "Invoice ID",
    },
    invoiceNumber: {
      type: "string",
      label: "Invoice Number",
      description: "Invoice Number",
    },
    customerExternalId: {
      propDefinition: [
        chaser,
        "customerExternalId",
      ],
    },
    status: {
      type: "string",
      label: "Status",
      description: "Invoice Status",
      options: [
        "DRAFT",
        "SUBMITTED",
        "AUTHORISED",
        "PAID",
        "VOIDED",
        "DELETED",
      ],
    },
    currencyCode: {
      type: "string",
      label: "Currency Code",
      description: "A 3-letter currency code such as `USD`, `EUR` or `GBP`",
    },
    amountDue: {
      type: "string",
      label: "Amount Due",
      description: "Amount Due (number)",
    },
    amountPaid: {
      type: "string",
      label: "Amount Paid",
      description: "Amount Paid (number)",
    },
    total: {
      type: "string",
      label: "Total",
      description: "Total (number)",
    },
    date: {
      type: "string",
      label: "Date",
      description: "Invoice date (date-time string such as `2024-04-23T11:00:00Z`)",
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "Invoice due date (date-time string such as `2024-04-23T11:00:00Z`)",
    },
    fullyPaidDate: {
      type: "string",
      label: "Fully Paid Date",
      description: "Invoice fully paid date (date-time string such as `2024-04-23T11:00:00Z`)",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.chaser.createInvoice({
      $,
      data: {
        invoice_id: this.invoiceId,
        invoice_number: this.invoiceNumber,
        status: this.status,
        currency_code: this.currencyCode,
        amount_due: Number(this.amountDue),
        amount_paid: Number(this.amountPaid),
        total: Number(this.total),
        date: this.date,
        due_date: this.dueDate,
        fully_paid_date: this.fullyPaidDate,
        customer_external_id: this.customerExternalId,
      },
    });

    $.export("$summary", `Successfully created invoice (ID: ${response?.data?.id})`);
    return response;
  },
};

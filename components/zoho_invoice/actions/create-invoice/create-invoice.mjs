import common from "../common/item.mjs";

export default {
  ...common,
  key: "zoho_invoice-create-invoice",
  name: "Create Invoice",
  description: "Creates a new invoice in Zoho Invoice. [See the documentation](https://www.zoho.com/invoice/api/v3/invoices/#create-an-invoice).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ...common.props,
    date: {
      description: "Invoice date. Date format is `yyyy-mm-dd`",
      propDefinition: [
        common.props.app,
        "date",
      ],
    },
  },
  methods: {
    ...common.methods,
    createInvoice(args = {}) {
      return this.app.post({
        path: "/invoices",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      customerId,
      invoiceNumber,
      date,
    } = this;

    const response = await this.createInvoice({
      step,
      data: {
        customer_id: customerId,
        invoice_number: invoiceNumber,
        date,
        line_items: this.getLineItems(),
      },
    });

    step.export("$summary", `Successfully created invoice with ID ${response.invoice.invoice_id}`);

    return response;
  },
};

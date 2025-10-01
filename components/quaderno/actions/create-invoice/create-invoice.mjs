import common from "../common/invoice.mjs";

export default {
  ...common,
  key: "quaderno-create-invoice",
  name: "Create Invoice",
  description: "Generate a new invoice in Quaderno. [See the Documentation](https://developers.quaderno.io/api/#tag/Invoices/operation/createInvoice).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
      firstName,
      lastName,
      dueDate,
      currency,
      recurringPeriod,
      recurringFrequency,
      country,
      postalCode,
      region,
      streetLine1,
      howManyItems,
    } = this;

    const response = await this.createInvoice({
      step,
      data: {
        contact: {
          first_name: firstName,
          last_name: lastName,
        },
        due_date: dueDate,
        currency,
        recurring_period: recurringPeriod,
        recurring_frequency: recurringFrequency,
        country,
        postal_code: postalCode,
        region,
        street_line_1: streetLine1,
        items_attributes: this.getItems(howManyItems),
      },
    });

    step.export("$summary", `Successfully created invoice with ID ${response.id}`);

    return response;
  },
};

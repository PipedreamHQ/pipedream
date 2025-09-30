import common from "../common/invoice.mjs";

export default {
  ...common,
  key: "quaderno-update-invoice",
  name: "Update Invoice",
  description: "Modify an existing invoice&#39;s details in Quaderno. [See the Documentation](https://developers.quaderno.io/api/#tag/Invoices/operation/updateInvoice).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ...common.props,
    invoiceId: {
      propDefinition: [
        common.props.app,
        "invoiceId",
      ],
    },
    howManyItems: {
      optional: true,
      propDefinition: [
        common.props.app,
        "howManyItems",
      ],
      description: "The items here will be ADDED to the existing invoice items",
    },
  },
  methods: {
    ...common.methods,
    updateInvoice({
      invoiceId, ...args
    } = {}) {
      return this.app.put({
        path: `/invoices/${invoiceId}`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      invoiceId,
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

    const response = await this.updateInvoice({
      step,
      invoiceId,
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

    step.export("$summary", `Successfully updated invoice with ID ${response.id}`);

    return response;
  },
};

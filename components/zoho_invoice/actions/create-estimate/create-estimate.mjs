import common from "../common/item.mjs";

export default {
  ...common,
  key: "zoho_invoice-create-estimate",
  name: "Create Estimate",
  description: "Creates a new estimate in Zoho Invoice. [See the documentation](https://www.zoho.com/invoice/api/v3/estimates/#create-an-estimate).",
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
      description: "The date on the estimate. Date format is `yyyy-mm-dd`",
      optional: true,
      propDefinition: [
        common.props.app,
        "date",
      ],
    },
  },
  methods: {
    ...common.methods,
    createEstimate(args = {}) {
      return this.app.post({
        path: "/estimates",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      customerId,
      estimateNumber,
      date,
    } = this;

    const response = await this.createEstimate({
      step,
      data: {
        customer_id: customerId,
        estimate_number: estimateNumber,
        date,
        line_items: this.getLineItems(),
      },
    });

    step.export("$summary", `Successfully created estimate with ID ${response.estimate.estimate_id}`);

    return response;
  },
};

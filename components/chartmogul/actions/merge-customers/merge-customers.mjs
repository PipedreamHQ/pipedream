import chartmogul from "../../chartmogul.app.mjs";

export default {
  key: "chartmogul-merge-customers",
  name: "Merge Customers",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Accepts details of two customer objects that you want to merge. [See the docs here](https://dev.chartmogul.com/reference/merge-customers)",
  type: "action",
  props: {
    chartmogul,
    from: {
      propDefinition: [
        chartmogul,
        "customerId",
      ],
      label: "From",
      description: "Details of the customer you want to merge data from.",
    },
    into: {
      propDefinition: [
        chartmogul,
        "customerId",
      ],
      label: "Into",
      description: "Details of the customer you want to merge data into.",
    },
  },
  async run({ $ }) {
    const {
      from,
      into,
    } = this;

    const response = await this.chartmogul.mergeCustomer({
      $,
      from: {
        customer_uuid: from,
      },
      into: {
        customer_uuid: into,
      },
    });

    $.export("$summary", "Customer Successfully merged");
    return response;
  },
};

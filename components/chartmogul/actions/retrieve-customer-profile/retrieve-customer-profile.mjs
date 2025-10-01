import chartmogul from "../../chartmogul.app.mjs";

export default {
  key: "chartmogul-retrieve-customer-profile",
  name: "Retrieve Customer Profile",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieves a customer object from your ChartMogul account. [See the docs here](https://dev.chartmogul.com/reference/retrieve-customer)",
  type: "action",
  props: {
    chartmogul,
    customerId: {
      propDefinition: [
        chartmogul,
        "customerId",
      ],
      description: "The ChartMogul UUID of the customer you are retrieving.",
    },
  },
  async run({ $ }) {
    const { customerId } = this;

    const response = await this.chartmogul.getCustomer({
      $,
      customerId,
    });

    $.export("$summary", "Customer Successfully fetched");
    return response;
  },
};

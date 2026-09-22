import shipstation from "../../shipstation.app.mjs";

export default {
  key: "shipstation-list-customer-email-options",
  name: "List Customer Email Options",
  description: "Retrieves available options for the Customer Email field. [See the documentation](https://docs.shipstation.com/apis/shipstation-v1/openapi/customers/list_customers)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    shipstation,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await shipstation.propDefinitions.customerEmail.options.call(this.shipstation, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};

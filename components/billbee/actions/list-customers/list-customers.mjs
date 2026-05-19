import app from "../../billbee.app.mjs";

export default {
  key: "billbee-list-customers",
  name: "List Customers",
  description: "Retrieve a list of customers. [See the documentation](https://app.billbee.io/swagger/ui/index#/Customers/Customer_GetAll)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    max: {
      type: "integer",
      label: "Maximum Results",
      description: "Maximum number of customers to return",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      max,
    } = this;

    const customers = await app.paginate({
      resourcesFn: app.listCustomers,
      resourcesFnArgs: {
        $,
      },
      resourceName: "Data",
      max,
    });

    $.export("$summary", `Successfully retrieved \`${customers.length}\` customers`);

    return customers;
  },
};

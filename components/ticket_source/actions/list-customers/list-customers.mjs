import ticketSource from "../../ticket_source.app.mjs";

export default {
  key: "ticket_source-list-customers",
  name: "List Customers",
  description: "Retrieves a list of all customers. [See the documentation](https://reference.ticketsource.io/#/operations/get-customers)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ticketSource,
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Optionally limit the maximum number of customers to return. Leave blank to retrieve all customers.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = this.ticketSource.paginate({
      $,
      fn: this.ticketSource.listCustomers,
      maxResults: this.maxResults,
    });

    const customers = [];
    for await (const customer of response) {
      customers.push(customer);
    }

    $.export("$summary", `Successfully retrieved ${customers.length} customer${customers.length === 1
      ? ""
      : "s"}`);
    return customers;
  },
};


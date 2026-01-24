import paystack from "../../paystack.app.mjs";

export default {
  key: "paystack-list-customers",
  name: "List Customers",
  description: "List customers on your integration. [See the documentation](https://paystack.com/docs/api/customer/#list)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  props: {
    paystack,
    from: {
      propDefinition: [
        paystack,
        "from",
      ],
      optional: true,
    },
    to: {
      propDefinition: [
        paystack,
        "to",
      ],
      optional: true,
    },
    maxResults: {
      propDefinition: [
        paystack,
        "maxResults",
      ],
      default: 50,
    },
  },
  async run({ $ }) {
    const params = {
      from: this.from,
      to: this.to,
    };
    const results = this.paystack.paginate({
      resourceFn: this.paystack.listCustomers,
      args: {
        $,
        params,
      },
      max: this.maxResults,
    });
    const customers = [];
    for await (const item of results) {
      customers.push(item);
    }

    $.export("$summary", `Successfully retrieved ${customers.length} customer${customers.length === 1
      ? ""
      : "s"}`);
    return customers;
  },
};

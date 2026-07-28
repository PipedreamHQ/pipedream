import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-customers",
  name: "List Customers",
  description: "Return a list of customers. [See the documentation](https://developer.surecart.com/api-reference/customers/list)",
  version: "1.0.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,
    email: {
      type: "string",
      label: "Email",
      description: "Filter customers by email address. Example: `customer@example.com`",
      optional: true,
    },
    ids: {
      propDefinition: [
        surecart,
        "ids",
      ],
    },
    licenseIds: {
      type: "string[]",
      label: "License IDs",
      description: "Filter by license IDs. Example: `[\"b47ca4c2-6cd2-41d5-aefb-4dc459642c56\"]`",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        surecart,
        "maxResults",
      ],
    },
    liveMode: {
      propDefinition: [
        surecart,
        "liveMode",
      ],
    },
    query: {
      type: "string",
      label: "Query",
      description: "Full-text search query to filter customers by name or email. Example: `Jane`",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Sort results by the specified field. Example: `created_at`",
      optional: true,
      options: [
        "created_at",
        "email",
        "name",
        "updated_at",
      ],
    },
  },
  async run({ $ }) {
    const results = this.surecart.paginate({
      fn: this.surecart.listCustomers,
      args: {
        $,
        params: {
          "email": this.email,
          "ids[]": this.ids,
          "license_ids[]": this.licenseIds,
          "live_mode": this.liveMode,
          "query": this.query,
          "sort": this.sort,
        },
      },
      max: this.maxResults,
    });

    const customers = [];
    for await (const customer of results) {
      customers.push(customer);
    }

    $.export("$summary", `Successfully retrieved ${customers.length} customer(s)`);
    return customers;
  },
};

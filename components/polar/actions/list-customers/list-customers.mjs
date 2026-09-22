import app from "../../polar.app.mjs";

export default {
  key: "polar-list-customers",
  name: "List Customers",
  description: "List customers according to the specified filters. [See the API docs](https://polar.sh/docs/api-reference/customers/list)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    organizationId: {
      propDefinition: [
        app,
        "organizationId",
      ],
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Filter by exact customer email.",
      optional: true,
    },
    query: {
      type: "string",
      label: "Query",
      description: "Filter by name, email, or external ID.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      organizationId: this.organizationId,
      email: this.email,
      query: this.query,
    };
    const customerList = await this.app.listCustomers(params);
    $.export("$summary", `Successfully retrieved ${customerList?.items?.length} customer(s)`);
    return customerList;
  },
};

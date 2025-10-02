import app from "../../repairshopr.app.mjs";

export default {
  key: "repairshopr-list-customers",
  name: "List Customers",
  description: "List Customers. [See the docs here](https://api-docs.repairshopr.com/#/Customer/get_customers)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    sort: {
      type: "string",
      label: "Sort",
      description: "A customer field to order by. Examples `firstname ASC`, `city DESC`",
      optional: true,
    },
    query: {
      type: "string",
      label: "Query",
      description: "Search Query",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Any customers with a first name like the parameter",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Any customers with a last name like the parameter",
      optional: true,
    },
    businessName: {
      type: "string",
      label: "Business Name",
      description: "Any customers with a business name like the parameter",
      optional: true,
    },
    id: {
      type: "integer[]",
      label: "ID",
      description: "Any customers with an ID in the list",
      optional: true,
    },
    notId: {
      type: "integer[]",
      label: "Not ID",
      description: "Any customers with an ID not in the list",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Any customers with an email like the parameter",
      optional: true,
    },
    includeDisabled: {
      type: "boolean",
      label: "Include Disabled",
      description: "Whether or not the returned list of customers includes disabled customers",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      sort: this.sort,
      query: this.query,
      firstname: this.firstName,
      lastname: this.lastName,
      business_name: this.businessName,
      id: this.id,
      not_id: this.notId,
      email: this.email,
      include_disabled: this.includeDisabled,
    };
    const data = [];
    let page = 1;
    while (true) {
      const { customers } = await this.app.listCustomers(page, params);
      for (const customer of customers) {
        data.push(customer);
      }
      if (customers.length === 0) {
        break;
      }
      page++;
    }
    $.export("$summary", `Fetched ${data.length} customer(s)`);
    return data;
  },
};

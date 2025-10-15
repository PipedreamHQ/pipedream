import helpcrunch from "../../helpcrunch.app.mjs";

export default {
  key: "helpcrunch-find-create-customer",
  name: "Find or Create Customer",
  description: "Search for an existing customer within Helpcrunch platform, if no match is found it creates a new customer record. [See the documentation](https://docs.helpcrunch.com/en/rest-api-v1/search-customers-v1)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    helpcrunch,
    name: {
      propDefinition: [
        helpcrunch,
        "name",
      ],
      optional: true,
    },
    email: {
      propDefinition: [
        helpcrunch,
        "email",
      ],
      optional: true,
    },
    company: {
      propDefinition: [
        helpcrunch,
        "company",
      ],
    },
    phone: {
      propDefinition: [
        helpcrunch,
        "phone",
      ],
    },
  },
  async run({ $ }) {
    const {
      helpcrunch,
      ...props
    } = this;

    const filter = [];
    for (const [
      key,
      value,
    ] of Object.entries(props)) {
      filter.push({
        field: `customers.${key}`,
        operator: "=",
        value,
      });
    }

    const { data: searchResponse } = await helpcrunch.searchCustomers({
      data: {
        comparison: "AND",
        filter,
      },
      $,
    });

    if (searchResponse?.length) {
      $.export("$summary", `Successfully found ${searchResponse.length} customer${searchResponse.length === 1
        ? ""
        : "s"} matching the criteria.`);
      return searchResponse;
    }

    const customer = await helpcrunch.createCustomer({
      data: {
        name: this.name,
        email: this.email,
        company: this.company,
        phone: this.phone,
      },
      $,
    });

    if (customer?.id) {
      $.export("$summary", `Successfully created customer with ID ${customer.id}.`);
    }

    return customer;
  },
};

import woocommerce from "../../woocommerce.app.mjs";
import pick from "lodash.pick";
import pickBy from "lodash.pickby";

export default {
  key: "woocommerce-search-customers",
  name: "Search Customers",
  description: "Finds a customer by searching. [See the docs](https://woocommerce.github.io/woocommerce-rest-api-docs/#list-all-customers)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    woocommerce,
    search: {
      propDefinition: [
        woocommerce,
        "search",
      ],
    },
    email: {
      propDefinition: [
        woocommerce,
        "email",
      ],
    },
    role: {
      propDefinition: [
        woocommerce,
        "role",
      ],
    },
    maxResults: {
      propDefinition: [
        woocommerce,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const { maxResults } = this;
    const params = {
      page: 1,
      per_page: 10,
      ...pickBy(pick(this, [
        "search",
        "email",
        "role",
      ])),
    };

    const customers = [];
    let results;
    do {
      results = await this.woocommerce.listCustomers(params);
      customers.push(...results);
      params.page += 1;
    } while (results.length === params.per_page && customers.length < maxResults);
    if (customers.length > maxResults) {
      customers.length = maxResults;
    }
    $.export("$summary", `Found ${customers.length} results`);
    return customers;
  },
};

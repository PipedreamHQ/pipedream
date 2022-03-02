import woocommerce from "../../woocommerce.app.mjs";

export default {
  key: "woocommerce-search-customers",
  name: "Search Customers",
  description: "Finds a customer by searching. [See the docs](https://woocommerce.github.io/woocommerce-rest-api-docs/#list-all-customers)",
  version: "0.0.1",
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
    const {
      search,
      email,
      role,
      maxResults,
    } = this;
    let params = {
      search,
      email,
      role,
      page: 1,
      per_page: 10,
    };
    // delete undefined props
    params = Object.entries(params).reduce((a, [
      k,
      v,
    ]) => (v
      ? (a[k] = v, a)
      : a), {});

    let customers = [];
    let results;
    do {
      results = await this.woocommerce.listCustomers(params);
      customers = [
        ...customers,
        ...results,
      ];
      params.page += 1;
    } while (results.length === params.per_page && customers.length < maxResults);
    if (customers.length > maxResults) {
      customers.length = maxResults;
    }
    $.export("$summary", `Found ${customers.length} results`);
    return customers;
  },
};

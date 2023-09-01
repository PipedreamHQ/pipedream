import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import querystring from "query-string";
import pick from "lodash.pick";
import pickBy from "lodash.pickby";

export default {
  key: "woocommerce-search-customers",
  name: "Search Customers",
  description: "Finds a customer by searching. [See the docs](https://woocommerce.github.io/woocommerce-rest-api-docs/#list-all-customers)",
  version: "0.0.2",
  type: "action",
  props: {
    woocommerce: {
      type: "app",
      app: "woocommerce",
    },
    search: {
      type: "string",
      label: "Search",
      description: "Limit results to those matching a string",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Limit result set to resources with a specific email",
      optional: true,
    },
    role: {
      type: "string",
      label: "Role",
      description: "Limit result set to resources with a specific role",
      options: [
        "all",
        "administrator",
        "editor",
        "author",
        "contributor",
        "subscriber",
        "customer",
      ],
      optional: true,
      default: "customer",
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of results to return",
      optional: true,
      default: 20,
    },
  },
  methods: {
    async getClient() {
      let url = this.$auth.url;

      if (!/^(http(s?):\/\/)/.test(url)) {
        url = `https://${url}`;
      }

      return new WooCommerceRestApi.default({
        url,
        consumerKey: this.$auth.key,
        consumerSecret: this.$auth.secret,
        wpAPI: true,
        version: "wc/v3",
      });
    },
    async listResources(endpoint) {
      const client = await this.getClient();
      return (await client.get(endpoint)).data;
    },
    async listCustomers(params = null) {
      const q = querystring.stringify(params);
      return this.listResources(`customers?${q}`);
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
      results = await this.listCustomers(params);
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

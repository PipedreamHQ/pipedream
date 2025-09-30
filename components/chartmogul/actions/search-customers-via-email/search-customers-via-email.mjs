import { ConfigurationError } from "@pipedream/platform";
import chartmogul from "../../chartmogul.app.mjs";

export default {
  key: "chartmogul-search-customers-via-email",
  name: "Search Customers Via Email",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Returns a list of all `customer` objects with the specified email address in your ChartMogul account. [See the docs here](https://dev.chartmogul.com/reference/search-for-customers)",
  type: "action",
  props: {
    chartmogul,
    email: {
      propDefinition: [
        chartmogul,
        "email",
      ],
      description: "The email address of the customer you are searching for.",
    },
  },
  async run({ $ }) {
    const { email } = this;

    try {
      const items = this.chartmogul.paginate({
        $,
        fn: this.chartmogul.searchCustomers,
        params: {
          email,
        },
      });

      const response = [];
      for await (const item of items) {
        response.push(item);
      }
      $.export("$summary", "Customers Successfully fetched");
      return response.reverse();
    } catch ({ response }) {
      throw new ConfigurationError(response.data.message);
    }
  },
};

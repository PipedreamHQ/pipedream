import { ConfigurationError } from "@pipedream/platform";
import chartmogul from "../../chartmogul.app.mjs";

export default {
  key: "chartmogul-search-customers-via-external-id",
  name: "Search Customers Via External Id",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Returns a list of all `customer` objects with the specified `external_id` in your ChartMogul account. [See the docs here](https://dev.chartmogul.com/reference/list-customers)",
  type: "action",
  props: {
    chartmogul,
    externalId: {
      propDefinition: [
        chartmogul,
        "externalId",
      ],
      description: "A unique external identifier of the customer that you want to retrieve.",
    },
  },
  async run({ $ }) {
    const { externalId } = this;

    try {
      const items = this.chartmogul.paginate({
        $,
        fn: this.chartmogul.listCustomers,
        params: {
          external_id: externalId,
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

import app from "../../alpaca.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  type: "action",
  key: "alpaca-list-orders",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  name: "List Orders",
  description: "Retrieves a list of orders for the account, filtered by the supplied query parameters, if no filter given all will be returned, [See the docs](https://alpaca.markets/docs/api-references/trading-api/orders/#get-a-list-of-orders)",
  props: {
    app,
    isPaperAPI: {
      propDefinition: [
        app,
        "isPaperAPI",
      ],
    },
    //the API does not provide pagination for symbols,
    //returns all at once and there are more than 3k symbols
    //because of these I preferred to get them from user input
    symbols: {
      type: "string[]",
      label: "Symbols",
      description: "A list of symbols to filter by (ex. `AAPL,TSLA,MSFT`). A currency pair is required for crypto orders (ex. `BTC/USD,BCH/USD,LTC/USDT,ETC/USDT`).",
      optional: true,
    },
    side: {
      propDefinition: [
        app,
        "side",
      ],
      description: "Filters down to orders that have a matching `side` field set.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Order status to be queried. `open`, `closed` or `all`. Defaults to `open`.",
      optional: true,
      options: [
        "open",
        "closed",
        "all",
      ],
    },
    after: {
      type: "string",
      label: "After",
      description: "The response will include only ones submitted after this time, in ISO 8601 format, e.g. `2022-09-07` or `2022-09-07T13:26:53`",
      optional: true,
    },
    until: {
      type: "string",
      label: "Until",
      description: "The response will include only ones submitted until this time, in ISO 8601 format, e.g. `2022-09-07` or `2022-09-07T13:26:53`",
      optional: true,
    },
    nested: {
      type: "string",
      label: "Nested",
      description: "If true, the result will roll up multi-leg orders under the `legs` field of primary order.",
      optional: true,
    },
  },
  async run ({ $ }) {
    const after = this.after && Date.parse(this.after);
    if (this.after && isNaN(after))
      throw new ConfigurationError("`After` should be in ISO 8601 format!");
    const until = this.until && Date.parse(this.until);
    if (this.until && isNaN(until))
      throw new ConfigurationError("`Until` should be in ISO 8601 format!");
    let pageSize = 25, orders = [], nextAfter = after && new Date(after).toISOString();
    while (true) {
      const response = await this.app.getOrders({
        $,
        isPaperAPI: this.isPaperAPI,
        params: {
          symbols: this.symbols && this.symbols.join(),
          side: this.side,
          status: this.status,
          after: nextAfter,
          until: until && new Date(until).toISOString(),
          nested: this.nested,
          direction: "asc",
          limit: pageSize,
        },
      });
      orders.push(...response);
      if (response.length < pageSize) {
        break;
      } else {
        nextAfter = response.pop().updated_at;
      }
    }
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `${orders.length} order${orders.length == 1 ? "" : "s"} has been retrieved.`);
    return orders;
  },
};

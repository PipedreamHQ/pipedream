import bitmex from "../../bitmex.app.mjs";

export default {
  key: "bitmex-list-trades",
  name: "List Trades",
  description: "Retrieve a list of executed trades from your BitMEX account. [See the documentation](https://www.bitmex.com/api/explorer/#!/Execution/Execution_getTradeHistory)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    bitmex,
    filter: {
      type: "object",
      label: "Filter",
      description: "Generic table filter. Send JSON key/value pairs, such as `{\"execType\": [\"Settlement\", \"Trade\"]}` to filter on multiple values. For explanations on filters refer to http://www.onixs.biz/fix-dictionary/5.0.SP2/msgType_8_8.html",
      optional: true,
    },
    symbol: {
      propDefinition: [
        bitmex,
        "symbol",
      ],
      optional: true,
    },
    columns: {
      type: "string[]",
      label: "Columns",
      description: "Array of column names to fetch. If omitted, will return all columns. Note that this method will always return item keys, even when not specified, so you may receive more columns that you expect.",
      optional: true,
    },
    count: {
      type: "integer",
      label: "Count",
      description: "Number of results to fetch. Must be a positive integer. Defaults to 100",
      optional: true,
      default: 100,
    },
    start: {
      type: "integer",
      label: "Start",
      description: "Starting point for results. Defaults to 0",
      optional: true,
      default: 0,
    },
    reverse: {
      type: "boolean",
      label: "Reverse",
      description: "If `true`, will sort results newest first. Defaults to `false`",
      optional: true,
      default: false,
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "Starting date filter for results (format: `YYYY-MM-DDTHH:mm:ss.sssZ`)",
      optional: true,
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "Ending date filter for results (format: `YYYY-MM-DDTHH:mm:ss.sssZ`)",
      optional: true,
    },
    targetAccountId: {
      type: "integer",
      label: "Target Account ID",
      description: "AccountId fetching the trade history, must be a paired account with main user",
      optional: true,
    },
    targetAccountIds: {
      type: "string",
      label: "Target Account IDs",
      description: "AccountIds fetching the trade history, must be a paired account with main user. Can be wildcard `*` to get all accounts linked to the authenticated user",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bitmex.getTradeHistory({
      filter: this.filter,
      symbol: this.symbol,
      columns: this.columns,
      count: this.count,
      start: this.start,
      reverse: this.reverse,
      startTime: this.startTime,
      endTime: this.endTime,
      targetAccountId: this.targetAccountId,
      targetAccountIds: this.targetAccountIds,
    });

    const count = Array.isArray(response)
      ? response.length
      : 0;
    $.export("$summary", `Successfully retrieved ${count} trade${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};

import yfs from "../../yahoo_fantasy_sports.app.mjs";

export default {
  key: "yahoo_fantasy_sports-get-league-transactions",
  name: "Get League Transactions",
  description: "List recent transactions (adds, drops, trades) for a league. [See the documentation](https://developer.yahoo.com/fantasysports/guide/#transactions-collection)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    yfs,
    league: {
      propDefinition: [
        yfs,
        "league",
      ],
    },
    eventTypes: {
      type: "string[]",
      label: "Transaction Types",
      description: "Filter by transaction type. Leave blank for all types",
      options: [
        "add",
        "drop",
        "trade",
        "commish",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const types = this.eventTypes?.length
      ? this.eventTypes
      : [
        "add",
        "drop",
        "trade",
        "commish",
      ];
    const transactions = await this.yfs.getLeagueTransactions(this.league, types);
    $.export("$summary", `Retrieved ${transactions.length} transactions`);
    return transactions;
  },
};

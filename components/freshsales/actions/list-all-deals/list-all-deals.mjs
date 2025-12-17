import freshsales from "../../freshsales.app.mjs";

export default {
  key: "freshsales-list-all-deals",
  name: "List All Deals",
  description: "Fetch all deals from your Freshsales account. [See the documentation](https://developer.freshsales.io/api/#list_all_deals)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    freshsales,
  },
  async run({ $ }) {
    const filterId = await this.freshsales.getFilterId({
      model: "deals",
      name: "All Deals",
    });

    const response = this.freshsales.paginate({
      fn: this.freshsales.listDeals,
      responseField: "deals",
      filterId,
    });

    const deals = [];
    for await (const deal of response) {
      deals.push(deal);
    }

    $.export("$summary", `Successfully fetched ${deals?.length || 0} deal${deals?.length === 1
      ? ""
      : "s"}`);
    return deals;
  },
};

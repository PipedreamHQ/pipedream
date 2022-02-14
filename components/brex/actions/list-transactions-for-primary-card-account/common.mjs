import { axios } from "@pipedream/platform";

export default {
  async run ({ $ }) {
    const {
      max,
      postedAtStart,
    } = this;

    let items = [];
    let cursor;

    const DEFAULT_LIMIT = 100;
    const limit = max
      ? Math.min(DEFAULT_LIMIT, parseInt(max))
      : DEFAULT_LIMIT;

    do {
      const res = await axios($, this.brexApp._getAxiosParams({
        method: "GET",
        path: "/v2/transactions/card/primary",
        params: {
          limit,
          posted_at_start: postedAtStart,
          cursor,
        },
      }));

      if (res.items) {
        items = [
          ...items,
          ...res.items,
        ];
      }

      cursor = res.next_cursor;
    } while (items.length < max && cursor);

    $.export("$summary", "Transactions successfully fetched");
    return items;
  },
};

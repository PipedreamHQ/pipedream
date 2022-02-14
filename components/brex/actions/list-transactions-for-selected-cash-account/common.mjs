import { axios } from "@pipedream/platform";

export default {
  async run ({ $ }) {
    const {
      max,
      postedAtStart,
      cashAccount,
    } = this;

    const DEFAULT_LIMIT = 100;
    const limit = Math.min(DEFAULT_LIMIT, parseInt(max));

    let items = [];
    let cursor;
    do {
      const res = await axios($, this.brexApp._getAxiosParams({
        method: "GET",
        path: `/v2/transactions/cash/${cashAccount}`,
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

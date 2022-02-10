import { axios } from "@pipedream/platform";

export default {
  props: {
    postedAtStart: {
      type: "string",
      label: "Posted At Start",
      description: "Shows only transactions with a posted_at_date on or after this date-time. This parameter is the date-time notation as defined by [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6). Example: `2022-12-12T23:59:59.999`",
      optional: true,
    },
    max: {
      type: "integer",
      label: "Max",
      description: "The maximum amount of registered that will be fetched. Defaults to `500`.",
      optional: true,
    },
  },
  async run ({ $ }) {
    const {
      max,
      postedAtStart,
      cashAccount,
    } = this;

    let items = [];
    let cursor;
    do {
      const res = await axios($, this.brexApp._getAxiosParams({
        method: "GET",
        path: `/transactions/cash/${cashAccount}`,
        params: {
          limit: 100,
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

import app from "../../stripe.app.mjs";

export default {
  key: "stripe-list-refunds",
  name: "List Refunds",
  type: "action",
  version: "0.2.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Find or list refunds. By default returns an array of refund objects. Set `Return Pagination Info` to true to instead receive `{ data, has_more, next_starting_after }` — useful when iterating through multiple pages by passing `next_starting_after` as `Starting After` on the next call. [See the documentation](https://stripe.com/docs/api/refunds/list).",
  props: {
    app,
    charge: {
      propDefinition: [
        app,
        "charge",
      ],
    },
    paymentIntent: {
      propDefinition: [
        app,
        "paymentIntent",
      ],
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
    endingBefore: {
      propDefinition: [
        app,
        "endingBefore",
      ],
    },
    startingAfter: {
      propDefinition: [
        app,
        "startingAfter",
      ],
    },
    returnPaginationInfo: {
      type: "boolean",
      label: "Return Pagination Info",
      description: "If `true`, returns an object `{ data, has_more, next_starting_after }` instead of a plain array. Set this when you need to know whether more results exist or want to paginate through additional pages.",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const {
      app,
      charge,
      paymentIntent,
      limit,
      endingBefore,
      startingAfter,
      returnPaginationInfo,
    } = this;

    const params = {
      charge,
      payment_intent: paymentIntent,
      ending_before: endingBefore,
      starting_after: startingAfter,
    };

    if (returnPaginationInfo) {
      // Fetch limit+1 to detect `has_more`, then trim to `limit`.
      const allItems = await app.sdk().refunds.list(params)
        .autoPagingToArray({
          limit: limit + 1,
        });

      const hasMore = allItems.length > limit;
      const items = hasMore
        ? allItems.slice(0, limit)
        : allItems;
      const nextStartingAfter = hasMore
        ? items[items.length - 1]?.id
        : null;

      // eslint-disable-next-line multiline-ternary
      $.export("$summary", `Successfully fetched ${items.length} refund${items.length === 1 ? "" : "s"}${hasMore ? " (more available)" : ""}`);

      return {
        data: items,
        has_more: hasMore,
        next_starting_after: nextStartingAfter,
      };
    }

    const items = await app.sdk().refunds.list(params)
      .autoPagingToArray({
        limit,
      });

    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully fetched ${items.length} refund${items.length === 1 ? "" : "s"}`);

    return items;
  },
};

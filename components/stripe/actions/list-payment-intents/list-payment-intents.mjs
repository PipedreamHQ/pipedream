import app from "../../stripe.app.mjs";

export default {
  key: "stripe-list-payment-intents",
  name: "List Payment Intents",
  type: "action",
  version: "0.2.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieves a list of payment intents that were previously created. By default returns an array of payment intent objects. Set `Return Pagination Info` to true to instead receive `{ data, has_more, next_starting_after }` — useful when iterating through multiple pages by passing `next_starting_after` as `Starting After` on the next call. [See the documentation](https://stripe.com/docs/api/payment_intents/list).",
  props: {
    app,
    customer: {
      propDefinition: [
        app,
        "customer",
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
      customer,
      limit,
      endingBefore,
      startingAfter,
      returnPaginationInfo,
    } = this;

    const params = {
      customer,
      ending_before: endingBefore,
      starting_after: startingAfter,
    };

    if (returnPaginationInfo) {
      // Fetch limit+1 to detect `has_more`, then trim to `limit`.
      const allItems = await app.sdk().paymentIntents.list(params)
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

      $.export("$summary", `Successfully fetched ${items.length} payment intent${items.length === 1 ? "" : "s"}${hasMore ? " (more available)" : ""}`);

      return {
        data: items,
        has_more: hasMore,
        next_starting_after: nextStartingAfter,
      };
    }

    const items = await app.sdk().paymentIntents.list(params)
      .autoPagingToArray({
        limit,
      });

    $.export("$summary", `Successfully fetched ${items.length} payment intent${items.length === 1 ? "" : "s"}`);

    return items;
  },
};

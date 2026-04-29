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
  description: "Find or list refunds. Returns up to `limit` refund objects per call. To paginate, read `has_more` and `next_starting_after` from this step's exports — pass `next_starting_after` as the `Starting After` prop on the next call to fetch the next page. [See the documentation](https://stripe.com/docs/api/refunds/list).",
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
  },
  async run({ $ }) {
    const {
      app,
      charge,
      paymentIntent,
      limit,
      endingBefore,
      startingAfter,
    } = this;

    // Fetch limit+1 internally to detect `has_more` accurately, then trim
    // back to `limit` before returning. This preserves the array return
    // shape while exposing pagination metadata via $.export.
    const allItems = await app.sdk().refunds.list({
      charge,
      payment_intent: paymentIntent,
      ending_before: endingBefore,
      starting_after: startingAfter,
    })
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
    $.export("has_more", hasMore);
    $.export("next_starting_after", nextStartingAfter);

    return items;
  },
};

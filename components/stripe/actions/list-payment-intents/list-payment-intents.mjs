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
  description: "Retrieves a list of payment intents that were previously created. Returns up to `limit` payment intent objects per call. To paginate, read `has_more` and `next_starting_after` from this step's exports — pass `next_starting_after` as the `Starting After` prop on the next call to fetch the next page. [See the documentation](https://stripe.com/docs/api/payment_intents/list).",
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
  },
  async run({ $ }) {
    const {
      app,
      customer,
      limit,
      endingBefore,
      startingAfter,
    } = this;

    // Fetch limit+1 internally to detect `has_more` accurately, then trim
    // back to `limit` before returning. This preserves the array return
    // shape while exposing pagination metadata via $.export.
    const allItems = await app.sdk().paymentIntents.list({
      customer,
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

    $.export("$summary", `Successfully fetched ${items.length} payment intent${items.length === 1 ? "" : "s"}${hasMore ? " (more available)" : ""}`);
    $.export("has_more", hasMore);
    $.export("next_starting_after", nextStartingAfter);

    return items;
  },
};

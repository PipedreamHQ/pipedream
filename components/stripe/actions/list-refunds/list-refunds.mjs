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
  description: "Find or list refunds. By default returns an array of refund objects (auto-paginated up to `Limit`). Set `Return Pagination Info` to true to instead receive `{ data, has_more, next_starting_after }` for a single Stripe page (max 100 per call) — pass `next_starting_after` as `Starting After` on the next call to iterate. [See the documentation](https://stripe.com/docs/api/refunds/list).",
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

    const result = await app.paginate({
      collection: "refunds",
      params,
      limit,
      returnPaginationInfo,
    });

    const items = returnPaginationInfo
      ? result.data
      : result;
    const count = items.length;
    const noun = count === 1
      ? "refund"
      : "refunds";
    const moreSuffix = returnPaginationInfo && result.has_more
      ? " (more available)"
      : "";
    $.export("$summary", `Successfully fetched ${count} ${noun}${moreSuffix}`);

    return result;
  },
};

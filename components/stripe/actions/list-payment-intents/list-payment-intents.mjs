import { ConfigurationError } from "@pipedream/platform";
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
  description: "Retrieves a list of payment intents that were previously created. By default returns an array of payment intent objects (auto-paginated up to `Limit`). Set `Return Pagination Info` to true to instead receive `{ data, has_more, next_starting_after }` for a single Stripe page (max 100 per call) — pass `next_starting_after` as `Starting After` on the next call to iterate. [See the documentation](https://stripe.com/docs/api/payment_intents/list).",
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
      description: "Maximum records to return. Auto-paginated up to 10000 by default; capped at 100 when `Return Pagination Info` is enabled (Stripe's per-call limit).",
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
      propDefinition: [
        app,
        "returnPaginationInfo",
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
      returnPaginationInfo,
    } = this;

    if (returnPaginationInfo && limit > 100) {
      throw new ConfigurationError("When `Return Pagination Info` is enabled, `Limit` must be 100 or fewer (Stripe caps single-page responses at 100). Disable the flag to auto-paginate up to 10000 results, or set Limit ≤ 100.");
    }

    if (startingAfter && endingBefore) {
      throw new ConfigurationError("Use either `Starting After` or `Ending Before`, not both.");
    }

    const params = {
      customer,
      ending_before: endingBefore,
      starting_after: startingAfter,
    };

    const result = await app.paginate({
      collection: "paymentIntents",
      params,
      limit,
      returnPaginationInfo,
    });

    const items = returnPaginationInfo
      ? result.data
      : result;
    const count = items.length;
    const noun = count === 1
      ? "payment intent"
      : "payment intents";
    const moreSuffix = returnPaginationInfo && result.has_more
      ? " (more available)"
      : "";
    $.export("$summary", `Successfully fetched ${count} ${noun}${moreSuffix}`);

    return result;
  },
};

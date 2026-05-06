import { ConfigurationError } from "@pipedream/platform";
import app from "../../stripe.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "stripe-list-customers",
  name: "List Customers",
  type: "action",
  version: "0.2.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Find or list customers. By default returns an array of customer objects (auto-paginated up to `Limit`). Set `Return Pagination Info` to true to instead receive `{ data, has_more, next_starting_after }` for a single Stripe page (max 100 per call) — pass `next_starting_after` as `Starting After` on the next call to iterate. [See the documentation](https://stripe.com/docs/api/customers/list).",
  props: {
    app,
    email: {
      propDefinition: [
        app,
        "email",
      ],
      description: "Search by customer email address (case-sensitive)",
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
      description: "Maximum records to return. Auto-paginated up to 10000 by default; capped at 100 when `Return Pagination Info` is enabled (Stripe's per-call limit).",
    },
    createdGt: {
      propDefinition: [
        app,
        "createdGt",
      ],
    },
    createdGte: {
      propDefinition: [
        app,
        "createdGte",
      ],
    },
    createdLt: {
      propDefinition: [
        app,
        "createdLt",
      ],
    },
    createdLte: {
      propDefinition: [
        app,
        "createdLte",
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
      propDefinition: [
        app,
        "returnPaginationInfo",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      email,
      limit,
      createdGt,
      createdGte,
      createdLt,
      createdLte,
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
      email,
      ...(createdGt || createdGte || createdLt || createdLte
        ? {
          created: {
            gt: utils.fromDateToInteger(createdGt),
            gte: utils.fromDateToInteger(createdGte),
            lt: utils.fromDateToInteger(createdLt),
            lte: utils.fromDateToInteger(createdLte),
          },
        }
        : {}
      ),
      ending_before: endingBefore,
      starting_after: startingAfter,
    };

    const result = await app.paginate({
      collection: "customers",
      params,
      limit,
      returnPaginationInfo,
    });

    const items = returnPaginationInfo
      ? result.data
      : result;
    const count = items.length;
    const noun = count === 1
      ? "customer"
      : "customers";
    const moreSuffix = returnPaginationInfo && result.has_more
      ? " (more available)"
      : "";
    $.export("$summary", `Successfully fetched ${count} ${noun}${moreSuffix}`);

    return result;
  },
};

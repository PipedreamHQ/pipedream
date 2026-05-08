import { ConfigurationError } from "@pipedream/platform";
import app from "../../stripe.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "stripe-list-invoices",
  name: "List Invoices",
  type: "action",
  version: "0.2.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Find or list invoices. By default returns an array of invoice objects (auto-paginated up to `Limit`). Set `Return Pagination Info` to true to instead receive `{ data, has_more, next_starting_after }` for a single Stripe page (max 100 per call) — pass `next_starting_after` as `Starting After` on the next call to iterate. [See the documentation](https://stripe.com/docs/api/invoices/list).",
  props: {
    app,
    customer: {
      propDefinition: [
        app,
        "customer",
      ],
    },
    subscription: {
      propDefinition: [
        app,
        "subscription",
        ({
          customer, price,
        }) => ({
          customer,
          price,
        }),
      ],
    },
    status: {
      type: "string",
      label: "Status",
      description: "If set, only returns invoices that are in the given status. Otherwise, all invoices are returned.",
      options: [
        "draft",
        "open",
        "paid",
        "uncollectible",
        "void",
      ],
      optional: true,
    },
    collectionMethod: {
      description: "The collection method of the invoice to retrieve.",
      propDefinition: [
        app,
        "collectionMethod",
      ],
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
      customer,
      subscription,
      status,
      collection_method,
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
      customer,
      subscription,
      status,
      collection_method,
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
      collection: "invoices",
      params,
      limit,
      returnPaginationInfo,
    });

    const items = returnPaginationInfo
      ? result.data
      : result;
    const count = items.length;
    const noun = count === 1
      ? "invoice"
      : "invoices";
    const moreSuffix = returnPaginationInfo && result.has_more
      ? " (more available)"
      : "";
    $.export("$summary", `Successfully fetched ${count} ${noun}${moreSuffix}`);

    return result;
  },
};

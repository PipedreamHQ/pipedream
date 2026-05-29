import { ConfigurationError } from "@pipedream/platform";
import app from "../../stripe.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "stripe-list-payouts",
  name: "List Payouts",
  type: "action",
  version: "0.2.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Find or list payouts. By default returns an array of payout objects (auto-paginated up to `Limit`). Set `Return Pagination Info` to true to instead receive `{ data, has_more, next_starting_after }` for a single Stripe page (max 100 per call) — pass `next_starting_after` as `Starting After` on the next call to iterate. [See the documentation](https://stripe.com/docs/api/payouts/list).",
  props: {
    app,
    status: {
      type: "string",
      label: "Payout Status",
      description: "The status of the payouts to be returned. If not specified, all payouts will be returned.",
      options: [
        "pending",
        "paid",
        "failed",
        "canceled",
      ],
      optional: true,
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
    arrivalDateGt: {
      propDefinition: [
        app,
        "arrivalDateGt",
      ],
    },
    arrivalDateGte: {
      propDefinition: [
        app,
        "arrivalDateGte",
      ],
    },
    arrivalDateLt: {
      propDefinition: [
        app,
        "arrivalDateLt",
      ],
    },
    arrivalDateLte: {
      propDefinition: [
        app,
        "arrivalDateLte",
      ],
    },
    destination: {
      type: "string",
      label: "Destination",
      description: "The ID of an external account - only return payouts sent to this external account.",
      optional: true,
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
  methods: {
    getOtherParams() {
      const {
        createdGt,
        createdGte,
        createdLt,
        createdLte,
        arrivalDateGt,
        arrivalDateGte,
        arrivalDateLt,
        arrivalDateLte,
      } = this;

      const hasCreatedFilters = createdGt
        || createdGte
        || createdLt
        || createdLte;

      const hasArrivalDateFilters = arrivalDateGt
        || arrivalDateGte
        || arrivalDateLt
        || arrivalDateLte;

      return {
        ...(hasCreatedFilters && {
          created: {
            gt: utils.fromDateToInteger(createdGt),
            gte: utils.fromDateToInteger(createdGte),
            lt: utils.fromDateToInteger(createdLt),
            lte: utils.fromDateToInteger(createdLte),
          },
        }),
        ...(hasArrivalDateFilters && {
          arrival_date: {
            gt: utils.fromDateToInteger(arrivalDateGt),
            gte: utils.fromDateToInteger(arrivalDateGte),
            lt: utils.fromDateToInteger(arrivalDateLt),
            lte: utils.fromDateToInteger(arrivalDateLte),
          },
        }),
      };
    },
  },
  async run({ $ }) {
    const {
      app,
      limit,
      status,
      destination,
      endingBefore,
      startingAfter,
      returnPaginationInfo,
      getOtherParams,
    } = this;

    if (returnPaginationInfo && limit > 100) {
      throw new ConfigurationError("When `Return Pagination Info` is enabled, `Limit` must be 100 or fewer (Stripe caps single-page responses at 100). Disable the flag to auto-paginate up to 10000 results, or set Limit ≤ 100.");
    }

    if (startingAfter && endingBefore) {
      throw new ConfigurationError("Use either `Starting After` or `Ending Before`, not both.");
    }

    const params = {
      status,
      destination,
      ending_before: endingBefore,
      starting_after: startingAfter,
      ...getOtherParams(),
    };

    const statusPrefix = status
      ? `${status} `
      : "";

    const result = await app.paginate({
      collection: "payouts",
      params,
      limit,
      returnPaginationInfo,
    });

    const items = returnPaginationInfo
      ? result.data
      : result;
    const count = items.length;
    const noun = count === 1
      ? "payout"
      : "payouts";
    const moreSuffix = returnPaginationInfo && result.has_more
      ? " (more available)"
      : "";
    $.export("$summary", `Successfully fetched ${count} ${statusPrefix}${noun}${moreSuffix}`);

    return result;
  },
};

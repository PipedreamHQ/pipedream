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
  description: "Find or list payouts. By default returns an array of payout objects. Set `Return Pagination Info` to true to instead receive `{ data, has_more, next_starting_after }` — useful when iterating through multiple pages by passing `next_starting_after` as `Starting After` on the next call. [See the documentation](https://stripe.com/docs/api/payouts/list).",
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
      type: "boolean",
      label: "Return Pagination Info",
      description: "If `true`, returns an object `{ data, has_more, next_starting_after }` instead of a plain array. Set this when you need to know whether more results exist or want to paginate through additional pages.",
      optional: true,
      default: false,
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

    if (returnPaginationInfo) {
      // Fetch limit+1 to detect `has_more`, then trim to `limit`.
      const allItems = await app.sdk().payouts.list(params)
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

      const count = items.length;
      const noun = count === 1
        ? "payout"
        : "payouts";
      const moreSuffix = hasMore
        ? " (more available)"
        : "";
      $.export("$summary", `Successfully fetched ${count} ${statusPrefix}${noun}${moreSuffix}`);

      return {
        data: items,
        has_more: hasMore,
        next_starting_after: nextStartingAfter,
      };
    }

    const items = await app.sdk().payouts.list(params)
      .autoPagingToArray({
        limit,
      });

    const count = items.length;
    const noun = count === 1
      ? "payout"
      : "payouts";
    $.export("$summary", `Successfully fetched ${count} ${statusPrefix}${noun}`);

    return items;
  },
};

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
  description: "Find or list payouts. Returns up to `limit` payout objects per call. To paginate, read `has_more` and `next_starting_after` from this step's exports — pass `next_starting_after` as the `Starting After` prop on the next call to fetch the next page. [See the documentation](https://stripe.com/docs/api/payouts/list).",
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
      getOtherParams,
    } = this;

    // Fetch limit+1 internally to detect `has_more` accurately, then trim
    // back to `limit` before returning. This preserves the array return
    // shape while exposing pagination metadata via $.export.
    const allItems = await app.sdk().payouts.list({
      status,
      destination,
      ending_before: endingBefore,
      starting_after: startingAfter,
      ...getOtherParams(),
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
    $.export("$summary", `Successfully fetched ${items.length} ${status ? `${status} ` : ""}payout${items.length === 1 ? "" : "s"}${hasMore ? " (more available)" : ""}`);
    $.export("has_more", hasMore);
    $.export("next_starting_after", nextStartingAfter);

    return items;
  },
};

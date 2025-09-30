import app from "../../stripe.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "stripe-list-payouts",
  name: "List Payouts",
  type: "action",
  version: "0.1.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Find or list payouts. [See the documentation](https://stripe.com/docs/api/payouts/list).",
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

    const resp = await app.sdk().payouts.list({
      limit,
      status,
      destination,
      ending_before: endingBefore,
      starting_after: startingAfter,
      ...getOtherParams(),
    })
      .autoPagingToArray({
        limit,
      });

    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully fetched ${status ? `${status} ` : ""}payouts`);
    return resp;
  },
};

import app from "../../stripe.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "stripe-list-payouts",
  name: "List Payouts",
  type: "action",
  version: "0.1.2",
  description: "Find or list payouts. [See the docs](https://stripe.com/docs/api/payouts/list) " +
    "for more information",
  props: {
    app,
    status: {
      propDefinition: [
        app,
        "payout_status",
      ],
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
  async run({ $ }) {
    const {
      app,
      limit,
      status,
      createdGt,
      createdGte,
      createdLt,
      createdLte,
      arrivalDateGt,
      arrivalDateGte,
      arrivalDateLt,
      arrivalDateLte,
      destination,
      endingBefore,
      startingAfter,
    } = this;

    const resp = await app.sdk().payouts.list({
      limit,
      status,
      destination,
      ending_before: endingBefore,
      starting_after: startingAfter,
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
      ...(arrivalDateGt || arrivalDateGte || arrivalDateLt || arrivalDateLte
        ? {
          arrival_date: {
            gt: utils.fromDateToInteger(arrivalDateGt),
            gte: utils.fromDateToInteger(arrivalDateGte),
            lt: utils.fromDateToInteger(arrivalDateLt),
            lte: utils.fromDateToInteger(arrivalDateLte),
          },
        }
        : {}
      ),
    })
      .autoPagingToArray({
        limit,
      });

    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully fetched ${status ? `${status} ` : ""}payouts`);
    return resp;
  },
};

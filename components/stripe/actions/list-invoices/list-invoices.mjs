import app from "../../stripe.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "stripe-list-invoices",
  name: "List Invoices",
  type: "action",
  version: "0.1.2",
  description: "Find or list invoices. [See the docs](https://stripe.com/docs/api/invoices/list) " +
    "for more information",
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
      propDefinition: [
        app,
        "invoice_status",
      ],
    },
    collection_method: {
      propDefinition: [
        app,
        "invoice_collection_method",
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
    } = this;

    const resp = await app.sdk().invoices.list({
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
    })
      .autoPagingToArray({
        limit,
      });
    $.export("$summary", "Successfully fetched invoices");
    return resp;
  },
};

import app from "../../stripe.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "stripe-list-invoices",
  name: "List Invoices",
  type: "action",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Find or list invoices. [See the documentation](https://stripe.com/docs/api/invoices/list).",
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
      limit,
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
    });
    $.export("$summary", `Successfully fetched ${resp.data.length} invoice${resp.data.length === 1 ? "" : "s"}${resp.has_more ? " (more available)" : ""}`);
    return resp;
  },
};

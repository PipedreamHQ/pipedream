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
  description: "Find or list invoices. Returns up to `limit` invoice objects per call. To paginate, read `has_more` and `next_starting_after` from this step's exports — pass `next_starting_after` as the `Starting After` prop on the next call to fetch the next page. [See the documentation](https://stripe.com/docs/api/invoices/list).",
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

    // Fetch limit+1 internally to detect `has_more` accurately, then trim
    // back to `limit` before returning. This preserves the array return
    // shape while exposing pagination metadata via $.export.
    const allItems = await app.sdk().invoices.list({
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
        limit: limit + 1,
      });

    const hasMore = allItems.length > limit;
    const items = hasMore
      ? allItems.slice(0, limit)
      : allItems;
    const nextStartingAfter = hasMore
      ? items[items.length - 1]?.id
      : null;

    $.export("$summary", `Successfully fetched ${items.length} invoice${items.length === 1 ? "" : "s"}${hasMore ? " (more available)" : ""}`);
    $.export("has_more", hasMore);
    $.export("next_starting_after", nextStartingAfter);

    return items;
  },
};

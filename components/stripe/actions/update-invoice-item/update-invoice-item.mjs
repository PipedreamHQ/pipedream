import app from "../../stripe.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "stripe-update-invoice-item",
  name: "Update Invoice Line Item",
  type: "action",
  version: "0.1.3",
  description: "Update an invoice line item. [See the documentation](https://stripe.com/docs/api/invoiceitems/update).",
  props: {
    app,
    // Used to filter subscription and invoice options
    customer: {
      propDefinition: [
        app,
        "customer",
      ],
    },
    // Used to filter invoice options
    subscription: {
      propDefinition: [
        app,
        "subscription",
        ({ customer }) => ({
          customer,
        }),
      ],
    },
    // Used to populate invoice item options
    invoice: {
      propDefinition: [
        app,
        "invoice",
        ({
          customer, subscription,
        }) => ({
          customer,
          subscription,
        }),
      ],
    },
    id: {
      propDefinition: [
        app,
        "invoiceItem",
        ({ invoice }) => ({
          invoice,
        }),
      ],
      optional: false,
    },
    amount: {
      propDefinition: [
        app,
        "amount",
      ],
    },
    currency: {
      propDefinition: [
        app,
        "currency",
      ],
    },
    quantity: {
      propDefinition: [
        app,
        "quantity",
      ],
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
    metadata: {
      propDefinition: [
        app,
        "metadata",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      id,
      amount,
      currency,
      quantity,
      description,
      metadata,
    } = this;

    const resp = await app.sdk().invoiceItems.update(id, {
      amount,
      currency,
      quantity,
      description,
      metadata: utils.parseJson(metadata),
    });
    $.export("$summary", `Successfully updated the invoice item, \`${resp.description || resp.id}\`.`);
    return resp;
  },
};

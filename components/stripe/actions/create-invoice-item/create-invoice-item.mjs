import app from "../../stripe.app.mjs";

export default {
  key: "stripe-create-invoice-item",
  name: "Create Invoice Line Item",
  type: "action",
  version: "0.1.3",
  description: "Add a line item to an invoice. [See the documentation](https://stripe.com/docs/api/invoiceitems/create).",
  props: {
    app,
    customer: {
      propDefinition: [
        app,
        "customer",
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
    pricingPrice: {
      propDefinition: [
        app,
        "price",
      ],
    },
    subscription: {
      propDefinition: [
        app,
        "subscription",
        ({ customer }) => ({
          customer,
        }),
      ],
    },
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
    quantity: {
      propDefinition: [
        app,
        "quantity",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      customer,
      amount,
      currency,
      description,
      metadata,
      pricingPrice,
      subscription,
      invoice,
      quantity,
    } = this;
    const resp = await app.sdk().invoiceItems.create({
      customer,
      amount,
      currency,
      description,
      metadata,
      subscription,
      invoice,
      quantity,
      ...(pricingPrice
        ? {
          pricing: {
            price: pricingPrice,
          },
        }
        : {}
      ),
    });

    $.export("$summary", "Successfully added new invoice item");

    return resp;
  },
};

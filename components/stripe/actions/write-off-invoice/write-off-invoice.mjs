import app from "../../stripe.app.mjs";

export default {
  key: "stripe-write-off-invoice",
  name: "Write Off Invoice",
  type: "action",
  version: "0.1.3",
  description: "Mark an invoice as uncollectible. [See the documentation](https://stripe.com/docs/api/invoices/mark_uncollectible).",
  props: {
    app,
    id: {
      propDefinition: [
        app,
        "invoice",
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const {
      app,
      id,
    } = this;

    const resp = await app.sdk().invoices.markUncollectible(id);
    $.export("$summary", `Successfully marked off the invoice, \`${resp.number || resp.id}\`.`);
    return resp;
  },
};

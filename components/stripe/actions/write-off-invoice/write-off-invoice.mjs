import app from "../../stripe.app.mjs";

export default {
  key: "stripe-write-off-invoice",
  name: "Write Off Invoice",
  type: "action",
  version: "0.1.0",
  description: "Mark an invoice as uncollectible. [See the " +
    "docs](https://stripe.com/docs/api/invoices/mark_uncollectible) for more information",
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
    const resp = await this.app.sdk().invoices.markUncollectible(this.id);
    $.export("$summary", `Successfully marked off the invoice, "${resp.number || resp.id}"`);
    return resp;
  },
};

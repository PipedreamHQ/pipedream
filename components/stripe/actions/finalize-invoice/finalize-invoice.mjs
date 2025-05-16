import app from "../../stripe.app.mjs";

export default {
  key: "stripe-finalize-invoice",
  name: "Finalize Draft Invoice",
  type: "action",
  version: "0.1.2",
  description: "Finalize a draft invoice. [See the " +
    "docs](https://stripe.com/docs/api/invoices/finalize) for more information",
  props: {
    app,
    id: {
      propDefinition: [
        app,
        "invoice",
      ],
      optional: false,
    },
    autoAdvance: {
      propDefinition: [
        app,
        "autoAdvance",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      id,
      autoAdvance,
    } = this;

    const resp = await app.sdk().invoices.finalizeInvoice(id, {
      ...(autoAdvance
        ? {
          auto_advance: autoAdvance,
        }
        : {}),
    });
    $.export("$summary", `Successfully finalized the invoice, "${resp.id}"`);
    return resp;
  },
};

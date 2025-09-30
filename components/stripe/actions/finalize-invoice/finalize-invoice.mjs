import app from "../../stripe.app.mjs";

export default {
  key: "stripe-finalize-invoice",
  name: "Finalize Draft Invoice",
  type: "action",
  version: "0.1.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Finalize a draft invoice. [See the documentation](https://stripe.com/docs/api/invoices/finalize).",
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
    $.export("$summary", `Successfully finalized the invoice with ID \`${resp.id}\`.`);
    return resp;
  },
};

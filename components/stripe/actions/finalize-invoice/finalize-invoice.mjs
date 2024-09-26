import pick from "lodash.pick";
import app from "../../stripe.app.mjs";

export default {
  key: "stripe-finalize-invoice",
  name: "Finalize Draft Invoice",
  type: "action",
  version: "0.1.0",
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
    auto_advance: {
      propDefinition: [
        app,
        "invoice_auto_advance",
      ],
    },
  },
  async run({ $ }) {
    const resp = await this.app.sdk().invoices.finalizeInvoice(this.id, pick(this, [
      "auto_advance",
    ]));
    $.export("$summary", `Successfully finalized the invoice, "${resp.id}"`);
    return resp;
  },
};

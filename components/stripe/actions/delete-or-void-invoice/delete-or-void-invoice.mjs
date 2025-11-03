import app from "../../stripe.app.mjs";

export default {
  key: "stripe-delete-or-void-invoice",
  name: "Delete Or Void Invoice",
  type: "action",
  version: "0.1.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Delete a draft invoice, or void a non-draft or subscription invoice. [See the documentation](https://stripe.com/docs/api/invoiceitems/delete).",
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

    const {
      status,
      subscription,
    } = await app.sdk().invoices.retrieve(id);

    if (status === "draft" && !subscription) {
      const resp = await app.sdk().invoices.del(id);
      $.export("$summary", `Successfully deleted the draft invoice with ID \`${resp.id}\`.`);
      return resp;
    }

    const resp = await app.sdk().invoices.voidInvoice(id);
    $.export("$summary", `Successfully voided the invoice with ID \`${resp.id}\`.`);
    return resp;
  },
};

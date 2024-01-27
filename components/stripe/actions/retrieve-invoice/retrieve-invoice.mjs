import app from "../../stripe.app.mjs";

export default {
  key: "stripe-retrieve-invoice",
  name: "Retrieve an Invoice",
  type: "action",
  version: "0.1.0",
  description: "Retrieves the details of an existing invoice. [See the " +
    "docs](https://stripe.com/docs/api/invoices/retrieve) for more information",
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
    const resp = await this.app.sdk().invoices.retrieve(this.id);
    $.export("$summary", `Successfully retrieved the invoice, "${resp.number || resp.id}"`);
    return resp;
  },
};

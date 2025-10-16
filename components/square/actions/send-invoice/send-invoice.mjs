import square from "../../square.app.mjs";

export default {
  key: "square-send-invoice",
  name: "Send Invoice",
  description: "Publishes the latest version of a specified invoice. [See the docs](https://developer.squareup.com/reference/square/invoices-api/publish-invoice).",
  type: "action",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    square,
    location: {
      propDefinition: [
        square,
        "location",
      ],
    },
    invoice: {
      propDefinition: [
        square,
        "invoice",
        (c) => ({
          location: c.location,
        }),
      ],
    },
  },
  async run({ $ }) {
    const { invoice } = await this.square.getInvoice({
      $,
      invoice: this.invoice,
    });
    const response = await this.square.publishInvoice({
      $,
      generateIdempotencyKey: true,
      invoice: this.invoice,
      data: {
        version: invoice.version,
      },
    });
    $.export("$summary", "Successfully published invoice");
    return response;
  },
};

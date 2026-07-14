import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-send-order-invoice",
  name: "Send Order Invoice",
  description: "Sends an invoice email for an existing order. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/orderInvoiceSend).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    shopify,
    orderId: {
      propDefinition: [
        shopify,
        "orderId",
      ],
    },
    to: {
      type: "string",
      label: "To",
      description: "Recipient email address. Defaults to the order's customer email if omitted.",
      optional: true,
    },
    from: {
      type: "string",
      label: "From",
      description: "Sender email address.",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Email subject line (e.g. `Your invoice from our store`).",
      optional: true,
    },
    customMessage: {
      type: "string",
      label: "Custom Message",
      description: "Custom message included in the invoice email body.",
      optional: true,
    },
    bcc: {
      type: "string[]",
      label: "BCC",
      description: "Array of email addresses to BCC on the invoice.",
      optional: true,
    },
  },
  async run({ $ }) {
    const emailInput = {
      to: this.to,
      from: this.from,
      subject: this.subject,
      customMessage: this.customMessage,
      bcc: this.bcc,
    };

    const response = await this.shopify.sendOrderInvoice({
      id: this.orderId,
      email: emailInput,
    });

    if (response.orderInvoiceSend?.userErrors?.length > 0) {
      throw new Error(response.orderInvoiceSend.userErrors.map(({ message }) => message).join(", "));
    }

    const { order } = response.orderInvoiceSend ?? {};
    $.export("$summary", `Successfully sent invoice for order \`${order?.name}\``);
    return response;
  },
};

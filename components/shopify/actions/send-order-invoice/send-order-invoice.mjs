import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-send-order-invoice",
  name: "Send Order Invoice",
  description:
    "Send an invoice email for a Shopify order."
    + " Use to send or resend a payment link or order summary to a customer."
    + " Use **Search Orders** to find the order ID."
    + " All email fields are optional — omit them to use the store's default invoice template."
    + " Returns the order object including `id` and `name` confirming the invoice was sent."
    + " [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/orderinvoicesend)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    shopify,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    info: {
      type: "alert",
      alertType: "info",
      content: "Please verify that the Shopify shop has order data properly defined and that your API credentials have been granted the required access scopes. [See the documentation](https://shopify.dev/docs/apps/launch/protected-customer-data)",
    },
    orderId: {
      propDefinition: [
        shopify,
        "orderId",
      ],
      description: "The ID of the order to invoice. Accepts a GID (`gid://shopify/Order/123`) or a plain numeric ID (`123`). Use **Search Orders** to find order IDs.",
    },
    to: {
      type: "string",
      label: "To Email",
      description: "Recipient email address. Defaults to the customer's email if omitted.",
      optional: true,
    },
    from: {
      type: "string",
      label: "From Email",
      description: "Sender email address. Must be a store or staff account email.",
      optional: true,
    },
    bcc: {
      type: "string[]",
      label: "BCC Emails",
      description: "Blind carbon copy email addresses. Must be store or staff account emails.",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Custom subject line for the invoice email",
      optional: true,
    },
    customMessage: {
      type: "string",
      label: "Custom Message",
      description: "Optional custom message to include in the invoice email body",
      optional: true,
    },
  },
  async run({ $ }) {
    const raw = String(this.orderId).trim();
    const orderId = raw.startsWith("gid://shopify/Order/")
      ? raw
      : /^\d+$/.test(raw)
        ? `gid://shopify/Order/${raw}`
        : raw;

    const email = {};
    if (this.to) email.to = this.to;
    if (this.from) email.from = this.from;
    if (this.bcc?.length) email.bcc = this.bcc;
    if (this.subject) email.subject = this.subject;
    if (this.customMessage) email.customMessage = this.customMessage;

    const response = await this.shopify.sendOrderInvoice({
      id: orderId,
      ...(Object.keys(email).length > 0 && {
        email,
      }),
    });
    if (response.orderInvoiceSend.userErrors.length > 0) {
      throw new Error(response.orderInvoiceSend.userErrors[0].message);
    }
    $.export("$summary", `Successfully sent invoice for order \`${response.orderInvoiceSend.order.name}\``);
    return response.orderInvoiceSend.order;
  },
};

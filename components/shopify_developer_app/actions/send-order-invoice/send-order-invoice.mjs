import { ConfigurationError } from "@pipedream/platform";
import shopify from "../../shopify_developer_app.app.mjs";

export default {
  key: "shopify_developer_app-send-order-invoice",
  name: "Send Order Invoice",
  description: "Sends an invoice for an order. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/OrderInvoiceSend)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
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
      label: "To Email",
      description: "The recipient email address for the invoice",
      optional: true,
    },
    from: {
      type: "string",
      label: "From Email",
      description: "The sender email address. Must be a store or staff account email",
      optional: true,
    },
    bcc: {
      type: "string[]",
      label: "BCC Emails",
      description: "Blind carbon copy email addresses. Must be store or staff account emails",
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
      description: "Optional custom message to include in the invoice email",
      optional: true,
    },
  },
  methods: {
    validateOrderId(orderId) {
      const prefix = "gid://shopify/Order/";
      const value = String(orderId).trim();
      if (value.startsWith(prefix)) {
        return value;
      }
      if (/^\d+$/.test(value)) {
        return `${prefix}${value}`;
      }
      throw new ConfigurationError(`Invalid order ID: ${orderId}`);
    },
  },
  async run({ $ }) {
    const orderId = this.validateOrderId(this.orderId);

    const email = {};
    if (this.to) email.to = this.to;
    if (this.from) email.from = this.from;
    if (this.bcc && this.bcc.length > 0) email.bcc = this.bcc;
    if (this.subject) email.subject = this.subject;
    if (this.customMessage) email.customMessage = this.customMessage;

    const variables = {
      id: orderId,
    };

    // Only include email object if at least one field is set
    if (Object.keys(email).length > 0) {
      variables.email = email;
    }

    const response = await this.shopify.sendOrderInvoice(variables);

    if (response.orderInvoiceSend.userErrors.length > 0) {
      throw new Error(response.orderInvoiceSend.userErrors[0].message);
    }

    $.export("$summary", `Successfully sent invoice for order ${response.orderInvoiceSend.order.name}`);
    return response;
  },
};

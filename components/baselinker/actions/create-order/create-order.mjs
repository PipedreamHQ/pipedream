import app from "../../baselinker.app.mjs";
import method from "../../common/method.mjs";

export default {
  key: "baselinker-create-order",
  name: "Create Order",
  description: "It allows adding a new order to the BaseLinker order manager. [See the Documentation](https://api.baselinker.com/index.php?method=addOrder).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    orderStatusId: {
      propDefinition: [
        app,
        "orderStatusId",
      ],
    },
    currency: {
      optional: true,
      propDefinition: [
        app,
        "currency",
      ],
    },
    paymentMethod: {
      type: "string",
      label: "Payment Method",
      description: "The payment method of the order.",
      optional: true,
    },
    paymentMethodCOD: {
      type: "boolean",
      label: "Payment Method COD",
      description: "Flag indicating whether the type of payment is COD (cash on delivery)",
      optional: true,
    },
    paid: {
      type: "boolean",
      label: "Paid",
      description: "Information whether the order is already paid. The value `1` automatically adds a full payment to the order.",
      optional: true,
    },
    userComments: {
      type: "string",
      label: "Buyer Comments",
      description: "Comments added by the customer when placing the order.",
      optional: true,
    },
    adminComments: {
      type: "string",
      label: "Seller Comments",
      description: "Comments added by the seller to the order.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the customer who placed the order.",
      optional: true,
    },
    wantInvoice: {
      type: "boolean",
      label: "Want Invoice",
      description: "Flag indicating whether the customer wants to receive an invoice.",
      optional: true,
    },
  },
  methods: {
    createOrder(args = {}) {
      return this.app.connector({
        ...args,
        data: {
          method: method.ADD_ORDER,
          ...args.data,
        },
      });
    },
  },
  async run({ $: step }) {
    const {
      orderStatusId,
      currency,
      paymentMethod,
      paymentMethodCOD,
      paid,
      userComments,
      adminComments,
      email,
      wantInvoice,
    } = this;

    const response = await this.createOrder({
      data: {
        parameters: {
          order_status_id: orderStatusId,
          currency,
          payment_method: paymentMethod,
          payment_method_cod: paymentMethodCOD,
          paid,
          user_comments: userComments,
          admin_comments: adminComments,
          email,
          want_invoice: wantInvoice,
        },
      },
    });

    step.export("$summary", `Successfully created order ${response.order_id}.`);

    return response;
  },
};

import square from "../../square.app.mjs";

export default {
  key: "square-create-invoice",
  name: "Create Invoice",
  description: "Creates a draft invoice for an order. You must send (publish) the invoice before Square can process it. [See the documentation](https://developer.squareup.com/reference/square/invoices-api/create-invoice).",
  type: "action",
  version: "0.0.5",
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
    order: {
      propDefinition: [
        square,
        "order",
        (c) => ({
          location: c.location,
        }),
      ],
    },
    customer: {
      propDefinition: [
        square,
        "customer",
      ],
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The due date for the payment request, in `YYYY-MM-DD` format",
    },
    acceptedPaymentMethods: {
      type: "string[]",
      label: "Accepted Payment Methods",
      description: "The payment methods that customers can use to pay the invoice on the Square-hosted invoice page. This setting is independent of any automatic payment requests for the invoice.",
      options: [
        "card",
        "square_gift_card",
        "bank_account",
        "buy_now_pay_later",
        "cash_app_pay",
      ],
    },
  },
  async run({ $ }) {
    const paymentRequests = [
      {
        request_type: "BALANCE",
        automatic_payment_source: "NONE",
        due_date: this.dueDate,
      },
    ];

    const acceptedPaymentMethods = {};
    this.acceptedPaymentMethods.forEach((method) => acceptedPaymentMethods[method] = true);

    const response = await this.square.createInvoice({
      $,
      generateIdempotencyKey: true,
      data: {
        invoice: {
          location_id: this.location,
          order_id: this.order,
          payment_requests: paymentRequests,
          delivery_method: "EMAIL",
          accepted_payment_methods: acceptedPaymentMethods,
          primary_recipient: {
            customer_id: this.customer,
          },
        },
      },
    });
    $.export("$summary", `Successfully created invoice with ID ${response.invoice.id}`);
    return response;
  },
};

import square from "../../square.app.mjs";

export default {
  key: "square-create-invoice",
  name: "Create Invoice",
  description: "Creates a draft invoice for an order. You must send (publish) the invoice before Square can process it. [See the docs](https://developer.squareup.com/reference/square/invoices-api/create-invoice).",
  type: "action",
  version: "0.0.3",
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
  },
  async run({ $ }) {
    const paymentRequests = [
      {
        request_type: "BALANCE",
        automatic_payment_source: "NONE",
        due_date: this.dueDate,
      },
    ];

    const response = await this.square.createInvoice({
      $,
      generateIdempotencyKey: true,
      data: {
        invoice: {
          location_id: this.location,
          order_id: this.order,
          payment_requests: paymentRequests,
          delivery_method: "EMAIL",
          accepted_payment_methods: {
            card: true,
            bank_account: true,
          },
          primary_recipient: {
            customer_id: this.customer,
          },
        },
      },
    });
    $.export("$summary", "Successfully created invoice");
    return response;
  },
};

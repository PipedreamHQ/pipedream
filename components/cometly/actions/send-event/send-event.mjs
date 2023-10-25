import cometly from "../../cometly.app.mjs";

export default {
  key: "cometly-send-event",
  name: "Send Event",
  description: "Sends an event to the Cometly API. [See the documentation](https://developers.cometly.com/)",
  version: "0.0.1",
  type: "action",
  props: {
    cometly,
    eventName: {
      propDefinition: [
        cometly,
        "eventName",
      ],
    },
    eventTime: {
      propDefinition: [
        cometly,
        "eventTime",
      ],
    },
    email: {
      propDefinition: [
        cometly,
        "email",
      ],
    },
    ip: {
      propDefinition: [
        cometly,
        "ip",
      ],
    },
    fullName: {
      propDefinition: [
        cometly,
        "fullName",
      ],
    },
    firstName: {
      propDefinition: [
        cometly,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        cometly,
        "lastName",
      ],
    },
    userAgent: {
      propDefinition: [
        cometly,
        "userAgent",
      ],
    },
    phone: {
      propDefinition: [
        cometly,
        "phone",
      ],
    },
    orderId: {
      propDefinition: [
        cometly,
        "orderId",
        (c) => ({
          eventName: [
            "purchase",
            "subscribe",
            "add_to_cart",
            "initiate_checkout",
            "add_payment_info",
            "sign_up",
          ].includes(c.eventName),
        }),
      ],
    },
    orderName: {
      propDefinition: [
        cometly,
        "orderName",
        (c) => ({
          eventName: [
            "purchase",
            "subscribe",
            "add_to_cart",
            "initiate_checkout",
            "add_payment_info",
            "sign_up",
          ].includes(c.eventName),
        }),
      ],
    },
    checkoutToken: {
      propDefinition: [
        cometly,
        "checkoutToken",
        (c) => ({
          eventName: [
            "purchase",
            "subscribe",
            "add_to_cart",
            "initiate_checkout",
            "add_payment_info",
            "sign_up",
          ].includes(c.eventName),
        }),
      ],
    },
    amount: {
      propDefinition: [
        cometly,
        "amount",
        (c) => ({
          eventName: [
            "purchase",
            "subscribe",
            "add_to_cart",
            "initiate_checkout",
            "add_payment_info",
            "sign_up",
          ].includes(c.eventName),
        }),
      ],
    },
  },
  async run() {
    const data = {
      event_name: this.eventName,
      event_time: this.eventTime,
      email: this.email,
      ip: this.ip,
      full_name: this.fullName,
      first_name: this.firstName,
      last_name: this.lastName,
      user_agent: this.userAgent,
      phone: this.phone,
      order_id: this.orderId,
      order_name: this.orderName,
      checkout_token: this.checkoutToken,
      amount: this.amount,
    };

    const response = await this.cometly.sendEvent({
      data: data,
    });

    this.$export("$summary", `Successfully sent event ${this.eventName}`);
    return response;
  },
};

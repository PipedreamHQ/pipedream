import { ConfigurationError } from "@pipedream/platform";
import cometly from "../../cometly.app.mjs";

export default {
  key: "cometly-send-event",
  name: "Send Event",
  description:
    "Sends an event to the Cometly API. [See the documentation]https://developers.cometly.com/#endpoint-advanced-method)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      ],
    },
    orderName: {
      propDefinition: [
        cometly,
        "orderName",
      ],
    },
    checkoutToken: {
      propDefinition: [
        cometly,
        "checkoutToken",
      ],
    },
    amount: {
      propDefinition: [
        cometly,
        "amount",
      ],
    },
  },
  async run({ $ }) {
    let eventTime =
      new Date(this.eventTime).valueOf() ||
      new Date(Number(this.eventTime)).valueOf();
    if (isNaN(eventTime)) {
      throw new ConfigurationError(
        "**Invalid event time.** Make sure it is a valid ISO 8601 date string.",
      );
    }

    const data = {
      event_name: this.eventName,
      event_time: Math.floor(eventTime / 1000),
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
      $,
      data,
    });

    $.export("$summary", `Successfully sent event "${this.eventName}"`);
    return response;
  },
};

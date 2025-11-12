import app from "../../customer_io.app.mjs";

export default {
  key: "customer_io-send-event-to-customer-io",
  name: "Send Event To Customer io",
  description: "Sends, tracks a customer event to Customer io. [See the docs here](https://customer.io/docs/api/#operation/track)",
  version: "0.3.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    customerId: {
      propDefinition: [
        app,
        "customerId",
      ],
    },
    eventName: {
      type: "string",
      label: "Event Name",
      description: "The name of the event to track.",
    },
    type: {
      type: "string",
      label: "Type",
      description: "Used to change event type. For Page View events set to \"page\".",
      optional: true,
    },
    customData: {
      type: "object",
      label: "Custom Data",
      description: "Custom data to include with the event.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      name: this.eventName,
      type: this.type,
      data: this.customData,
    };
    const res = await this.app.sendEventTo(this.customerId, data, $);
    $.export("$summary", "Successfully sent event");
    return res;
  },
};

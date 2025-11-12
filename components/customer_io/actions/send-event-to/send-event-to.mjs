import app from "../../customer_io.app.mjs";

export default {
  key: "customer_io-send-event-to",
  name: "Send Event To",
  description: "Sends an event to Customer.io. [See the docs here](https://customer.io/docs/api/#operation/track)",
  version: "0.2.2",
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
      description: "The name of the event you want to track.",
    },
    data: {
      type: "object",
      label: "Data",
      description: "Custom attributes to define the event.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      name: this.eventName,
      data: this.data,
    };
    await this.app.sendEventTo(this.customerId, data, $);
    $.export("$summary", "Successfully sent event");
  },
};

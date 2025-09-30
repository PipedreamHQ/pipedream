import ifttt from "../../ifttt.app.mjs";

export default {
  name: "Trigger Event with Values",
  description: "Trigger Event with 3 JSON values. [See docs](https://help.ifttt.com/hc/en-us/articles/115010230347-Webhooks-service-FAQ)",
  key: "ifttt-trigger-event-with-values",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ifttt,
    webhookKey: {
      propDefinition: [
        ifttt,
        "webhookKey",
      ],
    },
    eventName: {
      propDefinition: [
        ifttt,
        "eventName",
      ],
    },
    value1: {
      propDefinition: [
        ifttt,
        "value",
      ],
      label: "Value 1",
    },
    value2: {
      propDefinition: [
        ifttt,
        "value",
      ],
      label: "Value 2",
    },
    value3: {
      propDefinition: [
        ifttt,
        "value",
      ],
      label: "Value 3",
    },
  },
  async run({ $ }) {
    const response = await this.ifttt.callWebhookWithValues({
      $,
      webhookKey: this.webhookKey,
      eventName: this.eventName,
      data: {
        value1: this.value1,
        value2: this.value2,
        value3: this.value3,
      },
    });
    $.export("$summary", `Triggered webhook ${this.eventName}`);
    return response;
  },
};

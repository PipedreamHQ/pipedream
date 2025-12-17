import ifttt from "../../ifttt.app.mjs";

export default {
  name: "Trigger Event with JSON",
  description: "Trigger Event with an arbitrary JSON payload. [See docs](https://help.ifttt.com/hc/en-us/articles/115010230347-Webhooks-service-FAQ)",
  key: "ifttt-trigger-event-with-json",
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
    data: {
      propDefinition: [
        ifttt,
        "data",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.ifttt.callWebhookWithJSON({
      $,
      webhookKey: this.webhookKey,
      eventName: this.eventName,
      data: this.data,
    });
    $.export("$summary", `Triggered webhook ${this.eventName}`);
    return response;
  },
};

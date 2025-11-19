import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-create-webhook",
  name: "Create Webhook",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new webhook endpoint. [See the documentation](https://sendoso.docs.apiary.io/#reference/webhook-management)",
  type: "action",
  props: {
    sendoso,
    url: {
      type: "string",
      label: "Webhook URL",
      description: "The URL where webhook events will be sent.",
    },
    events: {
      type: "string[]",
      label: "Events",
      description: "Array of event types to subscribe to. Common events: send.created, send.delivered, send.cancelled, touch.created, touch.updated, contact.created, contact.updated, campaign.launched, campaign.paused.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Optional description of the webhook.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      url,
      events,
      description,
    } = this;

    const data = {
      url,
      events,
    };
    if (description) data.description = description;

    const response = await this.sendoso.createWebhook({
      $,
      ...data,
    });

    $.export("$summary", `Successfully created webhook for URL: ${url}`);
    return response;
  },
};


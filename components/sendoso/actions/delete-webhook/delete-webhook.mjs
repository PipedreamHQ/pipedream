import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-delete-webhook",
  name: "Delete Webhook",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Delete a webhook endpoint. [See the documentation](https://sendoso.docs.apiary.io/#reference/webhook-management)",
  type: "action",
  props: {
    sendoso,
    webhookId: {
      propDefinition: [
        sendoso,
        "webhookId",
      ],
    },
  },
  async run({ $ }) {
    const { webhookId } = this;

    const response = await this.sendoso.deleteWebhook({
      $,
      webhookId,
    });

    $.export("$summary", `Successfully deleted webhook ID: ${webhookId}`);
    return response;
  },
};


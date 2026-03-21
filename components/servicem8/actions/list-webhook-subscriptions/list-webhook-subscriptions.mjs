import app from "../../servicem8.app.mjs";

export default {
  key: "servicem8-list-webhook-subscriptions",
  name: "List Webhook Subscriptions",
  description: "List webhook subscriptions. [See the documentation](https://developer.servicem8.com/docs/webhooks-overview)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    servicem8: app,
  },
  async run({ $ }) {
    const response = await this.servicem8.listWebhooks({ $ });
    $.export("$summary", "Retrieved webhook subscriptions");
    return response;
  },
};

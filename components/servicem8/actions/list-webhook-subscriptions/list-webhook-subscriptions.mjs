import app from "../../servicem8.app.mjs";

export default {
  key: "servicem8-list-webhook-subscriptions",
  name: "List Webhook Subscriptions",
  description: "List webhook subscriptions. [See the documentation](https://developer.servicem8.com/reference/get_webhook_subscriptions)",
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
    const response = await this.servicem8.listWebhooks({
      $,
    });
    const count = Array.isArray(response)
      ? response.length
      : 0;
    $.export("$summary", `Retrieved ${count} webhook subscription${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};

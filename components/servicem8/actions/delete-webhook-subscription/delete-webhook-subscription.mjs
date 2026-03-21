import app from "../../servicem8.app.mjs";

export default {
  key: "servicem8-delete-webhook-subscription",
  name: "Delete Webhook Subscription",
  description: "Delete a webhook subscription for an object type. [See the documentation](https://developer.servicem8.com/docs/webhooks-overview)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8: app,
    object: {
      type: "string",
      label: "Object",
      description: "Object type to unsubscribe (e.g. `Job`)",
    },
  },
  async run({ $ }) {
    const response = await this.servicem8.removeHook({
      $,
      data: `object=${encodeURIComponent(this.object)}`,
    });
    $.export("$summary", `Deleted webhook subscription for ${this.object}`);
    return response;
  },
};

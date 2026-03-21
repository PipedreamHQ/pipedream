import app from "../../servicem8.app.mjs";

export default {
  key: "servicem8-create-webhook-subscription",
  name: "Create Webhook Subscription",
  description: "Create or update a webhook subscription (POST `webhook_subscriptions`). [See the documentation](https://developer.servicem8.com/docs/webhooks-overview)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8: app,
    callbackUrl: {
      type: "string",
      label: "Callback URL",
      description: "Public HTTPS URL that receives webhook POSTs",
    },
    object: {
      type: "string",
      label: "Object",
      description: "ServiceM8 object to subscribe to (e.g. `Job`, `Company`)",
    },
    fields: {
      type: "string",
      label: "Fields",
      description: "Comma-separated fields to include (optional; depends on object type)",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      callback_url: this.callbackUrl,
      object: this.object,
    };
    if (this.fields) params.fields = this.fields;
    const response = await this.servicem8.setHook({ $, params });
    $.export("$summary", "Webhook subscription saved");
    return response;
  },
};

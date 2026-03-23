import app from "../../servicem8.app.mjs";

export default {
  key: "servicem8-create-webhook-subscription",
  name: "Create Webhook Subscription",
  description: "Create or update an object webhook subscription. [See the documentation](https://developer.servicem8.com/reference/post_object_webhook_subscription)",
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
    // ServiceM8 expects subscription parameters as form-encoded POST body (not query string).
    const body = new URLSearchParams({
      callback_url: this.callbackUrl,
      object: this.object,
    });
    if (this.fields) {
      body.set("fields", this.fields);
    }
    const response = await this.servicem8.setHook({
      $,
      data: body.toString(),
    });
    $.export("$summary", "Webhook subscription saved");
    return response;
  },
};

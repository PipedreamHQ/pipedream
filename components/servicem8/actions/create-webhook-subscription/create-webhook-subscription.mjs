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
      description:
        "URI of the endpoint that receives webhook POSTs when a subscribed field changes (typically HTTPS).",
    },
    object: {
      type: "string",
      label: "Object",
      description:
        "Object type to subscribe to (e.g. job, company). Required; max 64 characters.",
    },
    fields: {
      type: "string",
      label: "Fields",
      description:
        "Comma-separated list of fields on the object to subscribe to.",
    },
    uniqueId: {
      type: "string",
      label: "Unique ID",
      optional: true,
      description:
        "Optional identifier for grouping subscriptions (max 100 characters).",
    },
  },
  async run({ $ }) {
    // ServiceM8 expects subscription parameters as form-encoded POST body (not query string).
    const body = new URLSearchParams({
      object: this.object,
      fields: this.fields,
      callback_url: this.callbackUrl,
    });
    if (this.uniqueId !== undefined && this.uniqueId !== null
      && String(this.uniqueId).trim() !== "") {
      body.set("unique_id", String(this.uniqueId).trim());
    }
    const response = await this.servicem8.setHook({
      $,
      data: body.toString(),
    });
    $.export("$summary", "Webhook subscription saved");
    return response;
  },
};

import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-validate-webhook",
  name: "Validate Webhook",
  description: "Validate a webhook URL for use with monitors. [See the documentation](https://docs.pubrio.com/en/api-reference/endpoint/monitors/webhook_validate)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pubrio,
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "The webhook URL to validate",
    },
    headers: {
      type: "string",
      label: "Headers",
      description: "Optional JSON string of custom headers to include",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      webhook_url: this.webhookUrl,
    };
    if (this.headers) {
      data.headers = this.pubrio.parseJsonField(this.headers, "headers", "object");
    }
    const response = await this.pubrio.validateWebhook({
      $,
      data,
    });
    $.export("$summary", "Successfully validated webhook");
    return response;
  },
};

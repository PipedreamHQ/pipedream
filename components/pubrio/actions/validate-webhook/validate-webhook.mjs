import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-validate-webhook",
  name: "Validate Webhook",
  description: "Validate a webhook URL for use with monitors. [See the documentation](https://docs.pubrio.com)",
  version: "0.0.1",
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
    if (this.headers) data.headers = this.headers;
    const response = await this.pubrio.makeRequest({
      $,
      method: "POST",
      url: "/monitors/webhook/validate",
      data,
    });
    $.export("$summary", "Successfully validated webhook");
    return response;
  },
};

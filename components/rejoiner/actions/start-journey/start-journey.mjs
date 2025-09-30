import rejoiner from "../../rejoiner.app.mjs";

export default {
  key: "rejoiner-start-journey",
  name: "Start Journey",
  description: "Triggers the beginning of a customer journey in Rejoiner. [See the documentation](https://docs.rejoiner.com/reference/trigger-webhook-journey)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    rejoiner,
    webhookUrl: {
      type: "string",
      label: "Webhook Endpoint URL",
      description: "Webhook URL of the journey. A webhook-triggered journey will provide an explicit Webhook Endpoint URL to be used for triggering the journey",
    },
    email: {
      propDefinition: [
        rejoiner,
        "email",
      ],
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Metadata to be attached to the customer's journey session metadata",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.rejoiner._makeRequest({
      $,
      method: "POST",
      url: this.webhookUrl,
      data: {
        email: this.email,
        session_data: this.metadata
          ? typeof this.metadata === "string"
            ? JSON.parse(this.metadata)
            : this.metadata
          : undefined,
      },
    });
    $.export("$summary", `Triggered journey for customer ${this.email}`);
    return response;
  },
};

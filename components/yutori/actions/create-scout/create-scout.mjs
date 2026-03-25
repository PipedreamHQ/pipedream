import yutori from "../../yutori.app.mjs";

export default {
  key: "yutori-create-scout",
  name: "Create Scout",
  description: "Create a Yutori Scout — a recurring web monitor that watches any part of the web on a schedule and alerts you when something relevant happens (price changes, news mentions, competitor updates, job postings, and more). Provide a **Webhook URL** to receive instant push notifications when findings arrive. [See the documentation](https://docs.yutori.com/reference/scouting-create)",
  version: "0.0.1",
  type: "action",
  annotations: {
    openWorldHint: true,
    destructiveHint: false,
    readOnlyHint: false,
  },
  props: {
    yutori,
    query: {
      propDefinition: [yutori, "query"],
      label: "Monitoring Query",
      description: "What to monitor, e.g. `Alert me when AAPL stock drops below $200`",
    },
    outputInterval: {
      type: "integer",
      label: "Run Interval (seconds)",
      description: "How often to run the scout, in seconds. Minimum 1800 (30 minutes). Default 86400 (daily).",
      optional: true,
      default: 86400,
      min: 1800,
    },
    userTimezone: {
      propDefinition: [yutori, "userTimezone"],
    },
    userLocation: {
      propDefinition: [yutori, "userLocation"],
    },
    skipEmail: {
      type: "boolean",
      label: "Skip Email Notifications",
      description: "Set to true to disable email notifications for this scout",
      optional: true,
      default: false,
    },
    webhookUrl: {
      propDefinition: [yutori, "webhookUrl"],
      description: "URL to receive a notification each time the scout produces new findings",
    },
    webhookFormat: {
      type: "string",
      label: "Webhook Format",
      description: "Format of the webhook payload. **Scout** (default) — structured JSON with nested scout and update objects. **Flat** — all fields at the top level, easier to map in automation tools. **Slack** — Slack Block Kit format, only use if the webhook URL is a Slack incoming webhook.",
      optional: true,
      default: "scout",
      options: [
        { label: "Scout (default)", value: "scout" },
        { label: "Flat", value: "zapier" },
        { label: "Slack", value: "slack" },
      ],
    },
  },
  async run({ $ }) {
    const payload = {
      query: this.query,
      output_interval: this.outputInterval,
      skip_email: this.skipEmail,
    };
    if (this.userTimezone) payload.user_timezone = this.userTimezone;
    if (this.userLocation) payload.user_location = this.userLocation;
    if (this.webhookUrl) {
      payload.webhook_url = this.webhookUrl;
      payload.webhook_format = this.webhookFormat || "scout";
    }

    const scout = await this.yutori.createScout($, payload);

    $.export("$summary", `Scout created: ${this.query.slice(0, 60)}`);
    return scout;
  },
};

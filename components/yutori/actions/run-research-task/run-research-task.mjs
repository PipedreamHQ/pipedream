import yutori from "../../yutori.app.mjs";

export default {
  key: "yutori-run-research-task",
  name: "Run Research Task",
  description: "Use Yutori to run deep web research across 100+ sources and get a comprehensive findings report — competitive analysis, market research, pricing comparisons, and more. Returns a task ID immediately; provide a **Webhook URL** to receive the full findings the moment research completes. [See the documentation](https://docs.yutori.com/reference/research-create)",
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
      propDefinition: [
        yutori,
        "query",
      ],
      label: "Research Query",
      description: "What to research, e.g. `What are the top 5 CRM tools for startups in 2025, with pricing?`",
    },
    userTimezone: {
      propDefinition: [
        yutori,
        "userTimezone",
      ],
    },
    userLocation: {
      propDefinition: [
        yutori,
        "userLocation",
      ],
    },
    webhookUrl: {
      propDefinition: [
        yutori,
        "webhookUrl",
      ],
      description: "URL to receive the result when research completes. Recommended for reliable delivery — Yutori will POST the findings to this URL.",
    },
  },
  async run({ $ }) {
    const payload = {
      query: this.query,
    };
    if (this.userTimezone) payload.user_timezone = this.userTimezone;
    if (this.userLocation) payload.user_location = this.userLocation;
    if (this.webhookUrl) {
      payload.webhook_url = this.webhookUrl;
      payload.webhook_format = "scout";
    }

    const created = await this.yutori.createResearchTask($, payload);

    $.export("$summary", `Research task started: ${this.query.slice(0, 60)}`);
    return created;
  },
};

import app from "../../serpkite.app.mjs";

export default {
  key: "serpkite-start-research",
  name: "Start Research",
  description: "Start an asynchronous deep-research task: planned web searches, page reading and a cited Markdown report. Returns a task `id` for **Get Research**. Charged by effort, only when the report is written ([see pricing](https://serpkite.com/pricing)). [See the documentation](https://serpkite.com/docs/endpoints/research)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    app,
    input: {
      type: "string",
      label: "Task",
      description: "The research task or question.",
    },
    effort: {
      type: "string",
      label: "Effort",
      description: "`lite`, `standard` (default) or `deep`: more searches and pages, and a higher price.",
      optional: true,
      options: [
        "lite",
        "standard",
        "deep",
      ],
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "Receives a signed `research.completed` event when the report is ready.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.post({
      $,
      path: "/research",
      data: {
        input: this.input,
        effort: this.effort,
        webhook_url: this.webhookUrl,
      },
    });
    $.export("$summary", `Started research ${response.id}`);
    return response;
  },
};

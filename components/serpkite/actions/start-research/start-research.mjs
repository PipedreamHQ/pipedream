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
      description: "The research task or question, up to 8,000 characters, e.g. `Compare the pricing and free tiers of the top five vector databases`.",
    },
    effort: {
      type: "string",
      label: "Effort",
      description: "`lite`, `standard` or `deep`: deeper research runs more searches and reads more pages, at a higher price, e.g. `lite`. Defaults to `standard`.",
      optional: true,
      options: [
        "lite",
        "standard",
        "deep",
      ],
    },
    webhookUrl: {
      propDefinition: [
        app,
        "webhookUrl",
      ],
      description: "A public HTTPS URL that receives a signed `research.completed` event when the task ends: completed, failed or canceled, so check its `status` (or call **Get Research**) before reading the report, e.g. `https://example.com/hooks/serpkite`. Defaults to the account webhook set in the SerpKite dashboard.",
    },
  },
  async run({ $ }) {
    const response = await this.app.startResearch({
      $,
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

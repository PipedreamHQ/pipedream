import yutori from "../../yutori.app.mjs";

export default {
  key: "yutori-run-browsing-task",
  name: "Run Browsing Task",
  description: "Use Yutori's cloud browser agent to navigate a website, fill forms, extract data, or complete any multi-step task — just describe it in plain English. Returns a task ID immediately; provide a **Webhook URL** to receive the full result the moment the task finishes. [See the documentation](https://docs.yutori.com/reference/browsing-create)",
  version: "0.0.1",
  type: "action",
  annotations: {
    openWorldHint: true,
    destructiveHint: false,
    readOnlyHint: false,
  },
  props: {
    yutori,
    task: {
      type: "string",
      label: "Task",
      description: "Natural language description of what to do on the website, e.g. `Find the cheapest flight from NYC to LA next Friday`",
    },
    startUrl: {
      type: "string",
      label: "Start URL",
      description: "The URL to start browsing from, e.g. `https://google.com/flights`",
    },
    maxSteps: {
      type: "integer",
      label: "Max Steps",
      description: "Maximum number of browser actions the agent can take (1–100)",
      optional: true,
      min: 1,
      max: 100,
      default: 50,
    },
    webhookUrl: {
      propDefinition: [
        yutori,
        "webhookUrl",
      ],
      description: "URL to receive the result when the task completes. Recommended for reliable delivery — Yutori will POST the result to this URL.",
    },
  },
  async run({ $ }) {
    const payload = {
      task: this.task,
      start_url: this.startUrl,
      max_steps: this.maxSteps,
    };
    if (this.webhookUrl) {
      payload.webhook_url = this.webhookUrl;
      payload.webhook_format = "scout";
    }

    const created = await this.yutori.createBrowsingTask($, payload);

    $.export("$summary", `Browsing task started: ${this.task.slice(0, 60)}`);
    return created;
  },
};

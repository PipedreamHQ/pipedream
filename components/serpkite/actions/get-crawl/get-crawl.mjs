import app from "../../serpkite.app.mjs";

export default {
  key: "serpkite-get-crawl",
  name: "Get Crawl",
  description: "Get the status and pages of a crawl started with **Start Crawl**. Results are kept for 24 hours. Free. [See the documentation](https://serpkite.com/docs/endpoints/crawl)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    app,
    taskId: {
      propDefinition: [
        app,
        "taskId",
      ],
      description: "The crawl's task ID, e.g. `0b9f3c1e-6a2d-4f5b-9c7e-2d4a8b1f6e30`. Use **Start Crawl** to get it (the `id` field).",
    },
  },
  async run({ $ }) {
    const response = await this.app.getCrawl({
      $,
      taskId: this.taskId,
    });
    $.export("$summary", `Crawl ${response.id} is ${response.status}`);
    return response;
  },
};

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

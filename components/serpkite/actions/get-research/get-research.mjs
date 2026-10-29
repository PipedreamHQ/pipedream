import app from "../../serpkite.app.mjs";

export default {
  key: "serpkite-get-research",
  name: "Get Research",
  description: "Get the status and report of a research task started with **Start Research**. Results are kept for 24 hours. Free. [See the documentation](https://serpkite.com/docs/endpoints/research)",
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
    const response = await this.app.getResearch({
      $,
      taskId: this.taskId,
    });
    $.export("$summary", `Research ${response.id} is ${response.status}`);
    return response;
  },
};

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
      description: "The research task ID, e.g. `0b9f3c1e-6a2d-4f5b-9c7e-2d4a8b1f6e30`. Use **Start Research** to get it (the `id` field).",
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

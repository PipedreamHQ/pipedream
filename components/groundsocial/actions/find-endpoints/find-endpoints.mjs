import app from "../../groundsocial.app.mjs";

export default {
  key: "groundsocial-find-endpoints",
  name: "Find Endpoints",
  description: "Find the Groundsocial endpoints that fit a task described in plain words, with their inputs and cost. Free. [See the documentation](https://groundsocial.dev/docs/api/utility-find-get)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    task: {
      type: "string",
      label: "Task",
      description: "What you want to do, e.g. `comments on a TikTok video`",
    },
    platform: {
      type: "string",
      label: "Platform",
      description: "Only return endpoints for this platform, e.g. `reddit` or `tiktok`. The **List Platforms** action returns every accepted value in `platforms[].id`",
      optional: true,
    },
  },
  async run({ $ }) {
    const { results } = await this.app.findEndpoints({
      $,
      params: {
        task: this.task,
        platform: this.platform,
      },
    });
    $.export("$summary", `Found ${results.length} endpoint${results.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};

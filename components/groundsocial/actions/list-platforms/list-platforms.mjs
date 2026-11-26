import app from "../../groundsocial.app.mjs";

export default {
  key: "groundsocial-list-platforms",
  name: "List Platforms",
  description: "List every Groundsocial platform with its `id`, status and endpoints with their prices. Free. [See the documentation](https://groundsocial.dev/docs/api/platforms-list)",
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
  },
  async run({ $ }) {
    const response = await this.app.listPlatforms({
      $,
    });
    const count = response.platforms?.length ?? 0;
    $.export("$summary", `Found ${count} platform${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};

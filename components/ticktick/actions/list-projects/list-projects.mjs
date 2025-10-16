import ticktick from "../../ticktick.app.mjs";

export default {
  key: "ticktick-list-projects",
  name: "List Projects",
  description: "List all projects in a TickTick account. [See the documentation](https://developer.ticktick.com/api#/openapi?id=get-user-project)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ticktick,
  },
  async run({ $ }) {
    const response = await this.ticktick.listProjects({
      $,
    });
    response && $.export("$summary", `Found ${response.length} project(s).`);
    return response;
  },
};

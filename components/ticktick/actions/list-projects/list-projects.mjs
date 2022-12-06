import ticktick from "../../ticktick.app.mjs";

export default {
  key: "ticktick-list-projects",
  name: "List Projects",
  description: "List all projects in a TickTick account",
  version: "0.0.1",
  type: "action",
  props: {
    ticktick,
  },
  async run({ $ }) {
    const response = await this.ticktick.listProjects($);
    response && $.export("$summary", `Found ${response.length} project(s).`);
    return response;
  },
};

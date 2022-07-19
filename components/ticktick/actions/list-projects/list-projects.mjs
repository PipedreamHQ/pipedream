import ticktick from "../../ticktick.app.mjs";

export default {
  key: "ticktick-list-projects",
  name: "List Projects",
  description: "List all projects in a TickTick account",
  //version: "0.0.1",
  version: "0.0.29",
  type: "action",
  props: {
    ticktick,
    username: {
      type: "string",
      label: "Username",
      description: "TickTick Username",
    },
    password: {
      type: "string",
      label: "Password",
      description: "TickTick Password",
    },
  },
  async run({ $ }) {
    // login user
    const { token } = await this.ticktick.login($, this.username, this.password);
    await this.ticktick.settings($, token);

    const response = await this.ticktick.listProjects($, token);
    response && $.export("$summary", `Found ${response.length} project(s).`);
    return response;
  },
};

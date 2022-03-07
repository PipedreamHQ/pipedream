import linearApp from "../../linear.app.mjs";

export default {
  key: "linear-get-teams",
  name: "Get Teams",
  description: "Get all the teams",
  version: "0.0.1",
  type: "action",
  props: {
    linearApp,
  },
  async run({ $ }) {
    const { nodes: teams } = await this.linearApp.listTeams();

    $.export("summary", `Found ${teams.length} teams`);

    return teams;
  },
};

import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-get-teams",
  name: "Get teams",
  description: "Get all the teams",
  version: "0.1.2",
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

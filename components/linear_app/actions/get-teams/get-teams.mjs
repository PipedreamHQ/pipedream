import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-get-teams",
  name: "Get Teams",
  description: "Get all the teams (API Key). See the docs [here](https://developers.linear.app/docs/graphql/working-with-the-graphql-api)",
  version: "0.2.5",
  type: "action",
  props: {
    linearApp,
  },
  async run({ $ }) {
    const { nodes: teams } = await this.linearApp.listTeams();

    $.export("$summary", `Found ${teams.length} teams(s)`);

    return teams;
  },
};

import linearApp from "../../linear_app.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "linear_app-get-teams",
  name: "Get Teams",
  description: "Get all the teams (API Key). See the docs [here](https://developers.linear.app/docs/graphql/working-with-the-graphql-api)",
  version: "0.2.8",
  type: "action",
  props: {
    linearApp,
    limit: {
      propDefinition: [
        linearApp,
        "limit",
      ],
      description: "Maximum number of teams to return. Defaults to 20 if not specified.",
    },
  },
  async run({ $ }) {
    // Use the specified limit or default to a reasonable number
    const limit = this.limit || constants.DEFAULT_NO_QUERY_LIMIT;

    const variables = {
      first: limit,
    };

    const { nodes: teams } = await this.linearApp.listTeams(variables);

    $.export("$summary", `Found ${teams.length} teams(s)`);

    return teams;
  },
};

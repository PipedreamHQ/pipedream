import linearApp from "../../linear_app.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "linear_app-get-teams",
  name: "Get Teams",
  description: "Retrieves all teams in your Linear workspace. Returns array of team objects with details like ID, name, and key. Supports pagination with configurable limit. Uses API Key authentication. See Linear docs for additional info [here](https://linear.app/developers/graphql).",
  version: "0.2.14",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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

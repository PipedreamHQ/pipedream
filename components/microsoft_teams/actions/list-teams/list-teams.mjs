import microsoftTeams from "../../microsoft_teams.app.mjs";

export default {
  key: "microsoft_teams-list-teams",
  name: "List Teams",
  description: "Lists all teams the authenticated user has joined. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-list-joinedteams)",
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    microsoftTeams,
  },
  async run({ $ }) {
    const teams = [];
    const paginator = this.microsoftTeams.paginate(this.microsoftTeams.listTeams);

    for await (const team of paginator) {
      teams.push(team);
    }

    $.export("$summary", `Successfully fetched ${teams.length} ${teams.length === 1
      ? "team"
      : "teams"}`);

    return teams;
  },
};

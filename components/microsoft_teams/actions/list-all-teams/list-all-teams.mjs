import microsoftTeams from "../../microsoft_teams.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "microsoft_teams-list-all-teams",
  name: "List All Teams",
  description: "Lists all teams in an organization including 365 groups. [See the docs here](https://docs.microsoft.com/en-us/graph/teams-list-all-teams?context=graph%2Fapi%2F1.0&view=graph-rest-1.0)",
  type: "action",
  version: "0.0.1",
  props: {
    microsoftTeams,
  },
  async run({ $ }) {
    let teams = [];

    const resourcesStream =
      await this.microsoftTeams.getResourcesStream({
        resourceFn: this.microsoftTeams.listAllTeamsInOrg,
        resourceFnArgs: {
          params: {
            select: "id,displayName,description",
            count: true,
            top: constants.DEFAULT_PAGE_LIMIT,
            skip: 0,
            version: "beta",
          },
        },
      });

    for await (const team of resourcesStream) {
      teams.push(team);
    }

    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully fetched ${teams?.length} ${teams?.length === 1 ? "team" : "teams"}`);

    return teams;
  },
};

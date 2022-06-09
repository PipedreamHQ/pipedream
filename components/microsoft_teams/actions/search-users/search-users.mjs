import microsoftTeams from "../../microsoft_teams.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "microsoft_teams-search-users",
  name: "Search Users",
  description: "Searches for users by a filter parameter. [See the docs here](https://docs.microsoft.com/en-us/graph/api/user-list?view=graph-rest-1.0&tabs=http)",
  type: "action",
  version: "0.0.1",
  props: {
    microsoftTeams,
    search: {
      propDefinition: [
        microsoftTeams,
        "userSearch",
      ],
    },
  },
  async run({ $ }) {
    let users = [];

    const resourcesStream =
      await this.microsoftTeams.getResourcesStream({
        resourceFn: this.microsoftTeams.listUsers,
        resourceFnArgs: {
          params: {
            ConsistencyLevel: "eventual",
            count: true,
            top: constants.DEFAULT_PAGE_LIMIT,
            skip: 0,
            search: this.search,
          },
        },
      });

    for await (const user of resourcesStream) {
      users.push(user);
    }

    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully fetched ${users?.length} ${users?.length === 1 ? "user" : "users"}`);

    return users;

  },
};

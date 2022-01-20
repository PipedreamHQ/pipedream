import microsoftTeams from "../../microsoft_teams.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "microsoft_teams-list-channels",
  name: "List Channels",
  description: "Lists all channels in a Microsoft Team. [See the docs here](https://docs.microsoft.com/en-us/graph/api/channel-list?view=graph-rest-1.0&tabs=http)",
  type: "action",
  version: "0.0.2",
  props: {
    microsoftTeams,
    teamId: {
      propDefinition: [
        microsoftTeams,
        "teamId",
      ],
    },
  },
  async run({ $ }) {
    let channels = [];

    const resourcesStream =
      await this.microsoftTeams.getResourcesStream({
        resourceFn: this.microsoftTeams.listChannels,
        resourceFnArgs: {
          teamId: this.teamId,
          params: {
            count: true,
            top: constants.DEFAULT_PAGE_LIMIT,
            skip: 0,
          },
        },
      });

    for await (const channel of resourcesStream) {
      channels.push(channel);
    }

    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully fetched ${channels?.length} ${channels?.length === 1 ? "channel" : "channels"}`);

    return channels;
  },
};

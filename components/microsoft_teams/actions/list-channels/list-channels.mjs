import microsoftTeams from "../../microsoft_teams.app.mjs";

export default {
  key: "microsoft_teams-list-channels",
  name: "List Channels",
  description: "Lists all channels in a Microsoft Team. [See the docs here](https://docs.microsoft.com/en-us/graph/api/channel-list?view=graph-rest-1.0&tabs=http)",
  type: "action",
  version: "0.0.12",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    microsoftTeams,
    teamId: {
      propDefinition: [
        microsoftTeams,
        "team",
      ],
    },
  },
  async run({ $ }) {
    const channels = [];
    const paginator = this.microsoftTeams.paginate(this.microsoftTeams.listChannels, {
      teamId: this.teamId,
    });

    for await (const channel of paginator) {
      channels.push(channel);
    }

    $.export("$summary", `Successfully fetched ${channels?.length} ${channels?.length === 1
      ? "channel"
      : "channels"}`);

    return channels;
  },
};

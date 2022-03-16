import microsoftTeams from "../../microsoft_teams.app.mjs";

export default {
  key: "microsoft_teams-list-channels",
  name: "List Channels",
  description: "Lists all channels in a Microsoft Team. [See the docs here](https://docs.microsoft.com/en-us/graph/api/channel-list?view=graph-rest-1.0&tabs=http)",
  type: "action",
  version: "0.0.36",
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
    const { value: channels } =
      await this.microsoftTeams.listChannels({
        teamId: this.teamId,
      });

    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully fetched ${channels?.length} ${channels?.length === 1 ? "channel" : "channels"}`);

    return channels;
  },
};

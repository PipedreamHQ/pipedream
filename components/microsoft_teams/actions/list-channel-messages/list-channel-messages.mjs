import microsoftTeams from "../../microsoft_teams.app.mjs";

export default {
  key: "microsoft_teams-list-channel-messages",
  name: "List Channel Messages",
  description: "Lists messages in a Microsoft Teams channel. [See the documentation](https://learn.microsoft.com/en-us/graph/api/channel-list-messages)",
  type: "action",
  version: "0.0.1",
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
    channelId: {
      propDefinition: [
        microsoftTeams,
        "channel",
        ({ teamId }) => ({
          teamId,
        }),
      ],
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of messages to return",
      optional: true,
    },
  },
  async run({ $ }) {
    const messages = [];
    const paginator = this.microsoftTeams.paginate(this.microsoftTeams.listChannelMessages, {
      teamId: this.teamId,
      channelId: this.channelId,
    });

    for await (const message of paginator) {
      messages.push(message);
      if (this.maxResults && messages.length >= this.maxResults) {
        break;
      }
    }

    $.export("$summary", `Successfully fetched ${messages.length} message${messages.length === 1
      ? ""
      : "s"}`);
    return messages;
  },
};

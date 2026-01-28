import microsoftTeams from "../../microsoft_teams.app.mjs";

export default {
  key: "microsoft_teams-send-channel-message",
  name: "Send Channel Message",
  description: "Send a message to a team&#39;s channel. [See the docs here](https://docs.microsoft.com/en-us/graph/api/channel-post-messages?view=graph-rest-1.0&tabs=http)",
  type: "action",
  version: "0.0.12",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
    message: {
      propDefinition: [
        microsoftTeams,
        "message",
      ],
    },
    contentType: {
      propDefinition: [
        microsoftTeams,
        "contentType",
      ],
    },
  },
  async run({ $ }) {
    const {
      teamId,
      channelId,
      message,
      contentType,
    } = this;

    const response =
      await this.microsoftTeams.sendChannelMessage({
        teamId,
        channelId,
        content: {
          body: {
            content: message,
            contentType,
          },
        },
      });

    $.export("$summary", `Successfully sent message to channel ${channelId}`);

    return response;
  },
};

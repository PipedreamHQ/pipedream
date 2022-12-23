import microsoftTeams from "../../microsoft_teams.app.mjs";

export default {
  key: "microsoft_teams-send-channel-message",
  name: "Send Channel Message",
  description: "Send a message to a team&#39;s channel. [See the docs here](https://docs.microsoft.com/en-us/graph/api/channel-post-messages?view=graph-rest-1.0&tabs=http)",
  type: "action",
  version: "0.0.2",
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
  },
  async run({ $ }) {
    const {
      teamId,
      channelId,
      message,
    } = this;

    const response =
      await this.microsoftTeams.sendChannelMessage({
        teamId,
        channelId,
        content: {
          body: {
            content: message,
          },
        },
      });

    $.export("$summary", `Successfully sent message to channel ${channelId}`);

    return response;
  },
};

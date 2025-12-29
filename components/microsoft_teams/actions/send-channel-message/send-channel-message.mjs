import showdown from "showdown";
import { parseHTML } from "linkedom";
import microsoftTeams from "../../microsoft_teams.app.mjs";

export default {
  key: "microsoft_teams-send-channel-message",
  name: "Send Channel Message",
  description: "Send a message to a team&#39;s channel. [See the docs here](https://docs.microsoft.com/en-us/graph/api/channel-post-messages?view=graph-rest-1.0&tabs=http)",
  type: "action",
  version: "0.0.11",
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

    let content = message;
    let type = contentType;

    if (contentType === "markdown") {
      const converter = new showdown.Converter();
      const dom = parseHTML("");
      content = converter.makeHtml(message, dom.window.document);
      type = "html";
    }

    const response =
      await this.microsoftTeams.sendChannelMessage({
        teamId,
        channelId,
        content: {
          body: {
            content,
            contentType: type,
          },
        },
      });

    $.export("$summary", `Successfully sent message to channel ${channelId}`);

    return response;
  },
};

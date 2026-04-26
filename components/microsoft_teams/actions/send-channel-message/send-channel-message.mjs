import microsoftTeams from "../../microsoft_teams.app.mjs";

export default {
  key: "microsoft_teams-send-channel-message",
  name: "Send Channel Message",
  description: "Send a message to a team's channel. Optionally include inline images via `hostedContents`. [See the documentation](https://learn.microsoft.com/en-us/graph/api/chatmessage-post?view=graph-rest-1.0&tabs=http)",
  type: "action",
  version: "0.1.0",
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
    hostedContents: {
      type: "string[]",
      label: "Hosted Contents",
      description: "An array of JSON strings, each representing an inline hosted image to attach. Each item must be a JSON object with `'@microsoft.graph.temporaryId'` (string), `contentBytes` (base64-encoded image data), and `contentType` (MIME type, e.g. `image/png`). Example: `{\"@microsoft.graph.temporaryId\": \"1\", \"contentBytes\": \"BASE64_STRING\", \"contentType\": \"image/png\"}`. Reference each image in your HTML message body using `<img src=\"../hostedContents/1/$value\">`. [See the docs](https://learn.microsoft.com/en-us/graph/api/chatmessage-post?view=graph-rest-1.0&tabs=http#example-6-send-inline-images-along-with-the-message)",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      teamId,
      channelId,
      message,
      contentType,
      hostedContents,
    } = this;

    const parsedHostedContents = hostedContents?.map((item) =>
      typeof item === "string"
        ? JSON.parse(item)
        : item);

    const content = {
      body: {
        content: message,
        contentType: contentType ?? "text",
      },
    };

    if (parsedHostedContents?.length) {
      content.hostedContents = parsedHostedContents;
    }

    const response = await this.microsoftTeams.sendChannelMessage({
      teamId,
      channelId,
      content,
    });

    $.export("$summary", `Successfully sent message to channel ${channelId}`);
    return response;
  },
};

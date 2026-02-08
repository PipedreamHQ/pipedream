import { ConfigurationError } from "@pipedream/platform";
import app from "../../trengo.app.mjs";

export default {
  type: "action",
  key: "trengo-send-a-team-chat-message",
  version: "0.0.11",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Send A Team Chat Message",
  description: "Send a message as a bot in the Team Chat, [See the documentation](https://developers.trengo.com/reference/sending-a-bot-message)",
  props: {
    app,
    threadId: {
      propDefinition: [
        app,
        "threadId",
      ],
    },
    toUserId: {
      propDefinition: [
        app,
        "toUserId",
      ],
    },
    body: {
      propDefinition: [
        app,
        "body",
      ],
    },
    attachmentIds: {
      propDefinition: [
        app,
        "attachmentIds",
      ],
    },
    parentId: {
      propDefinition: [
        app,
        "parentId",
      ],
    },
  },
  async run ({ $ }) {
    if (!this.threadId && !this.toUserId) {
      throw new ConfigurationError("Either `Thread ID` or `To User ID` should be set!");
    }
    if (!this.body && !this.attachmentIds) {
      throw new ConfigurationError("Either `Body` or `Attachement IDs` should be set!");
    }
    const resp = await this.app.sendTeamChatMessage({
      $,
      data: {
        bot: true,
        threadId: this.threadId,
        toUserId: this.toUserId,
        body: this.body,
        attachmentIds: this.attachmentIds,
        parentId: this.parentId,
      },
    });
    $.export("$summary", "The message has been sent");
    return resp;
  },
};

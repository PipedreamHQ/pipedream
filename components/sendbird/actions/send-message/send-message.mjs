import app from "../../sendbird.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "sendbird-send-message",
  name: "Send message",
  description: "Sends a message to a channel. [See the docs here](https://sendbird.com/docs/chat/v3/platform-api/message/messaging-basics/send-a-message)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    applicationId: {
      propDefinition: [
        app,
        "applicationId",
      ],
    },
    channelType: {
      propDefinition: [
        app,
        "channelType",
      ],
    },
    channelUrl: {
      propDefinition: [
        app,
        "channelUrl",
        (c) => ({
          applicationId: c.applicationId,
          channelType: c.channelType,
        }),
      ],
    },
    userId: {
      propDefinition: [
        app,
        "userId",
        (c) => ({
          applicationId: c.applicationId,
        }),
      ],
    },
    sendPush: {
      propDefinition: [
        app,
        "sendPush",
      ],
    },
    mentionType: {
      propDefinition: [
        app,
        "mentionType",
      ],
    },
    mentionedUserIds: {
      propDefinition: [
        app,
        "mentionedUserIds",
        (c) => ({
          applicationId: c.applicationId,
        }),
      ],
    },
    isSilent: {
      propDefinition: [
        app,
        "isSilent",
      ],
    },
    dedupId: {
      propDefinition: [
        app,
        "dedupId",
      ],
    },
    messageType: {
      propDefinition: [
        app,
        "messageType",
      ],
      description: "Specifies the type of the message.",
      optional: false,
      reloadProps: true,
    },
  },
  async additionalProps() {
    if (!this.messageType) {
      return {};
    }
    if (this.messageType === "FILE") {
      return {
        url: {
          type: "string",
          label: "URL",
          description: "Specifies the URL of the file hosted on the server of your own or other third-party companies.",
        },
        fileName: {
          type: "string",
          label: "File Name",
          description: "The file name can be set to any string you want using the file name request property. If no file name is supplied, the name response property defaults to an empty string.",
          optional: true,
        },
      };
    }
    return {
      message: {
        type: "string",
        label: "Message",
        description: "Specifies the content of the message.",
      },
    };
  },
  async run({ $ }) {
    const opts = {
      message: this.message,
      url: this.url,
      file_name: this.fileName,
      user_id: this.userId,
      message_type: this.messageType,
      send_push: this.sendPush,
      mention_type: this.mentionType,
      mentioned_user_ids: this.mentionedUserIds,
      is_silent: this.isSilent,
      dedup_id: this.dedupId,
    };
    try {
      const message = await this.app.sendMessage(
        this.applicationId,
        this.channelType,
        this.channelUrl,
        opts,
      );
      $.export("$summary", `Successfully sent message with ID: ${message.message_id}`);
      return message;
    } catch (ex) {
      throw new ConfigurationError(ex?.body?.message);
    }
  },
};

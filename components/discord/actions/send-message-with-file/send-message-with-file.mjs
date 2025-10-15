import common from "../common/common.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";

export default {
  ...common,
  key: "discord-send-message-with-file",
  name: "Send Message With File",
  description: "Post a message with an attached file",
  version: "2.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    message: {
      propDefinition: [
        common.props.discord,
        "message",
      ],
      optional: true,
    },
    file: {
      type: "string",
      label: "File Path Or Url",
      description: "Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/example.pdf`)",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      message,
      avatarURL,
      threadID,
      username,
      file,
      includeSentViaPipedream,
      suppressNotifications,
    } = this;

    const {
      stream,
      metadata,
    } = await getFileStreamAndMetadata(file);

    stream.name = metadata.name;

    try {
      const resp = await this.discord.sendMessage(this.channel, {
        avatar_url: avatarURL,
        username,
        file: stream,
        flags: this.getMessageFlags(suppressNotifications),
        content: includeSentViaPipedream
          ? this.appendPipedreamText(message ?? "")
          : message,
      }, {
        thread_id: threadID,
      });
      $.export("$summary", "Message sent successfully");
      return resp || {
        success: true,
      };
    } catch (err) {
      const unsentMessage = this.getUserInputProps();
      $.export("unsent", unsentMessage);
      throw err;
    }
  },
};

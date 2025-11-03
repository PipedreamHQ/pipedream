import { ConfigurationError } from "@pipedream/platform";
import common from "../../common.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

const { discord } = common.props;

export default {
  key: "discord_bot-send-message-with-file",
  name: "Send Message With File",
  description: "Post a message with an attached file. [See the docs here](https://discord.com/developers/docs/reference#uploading-files)",
  version: "1.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    discord,
    ...common.props,
    file: {
      type: "string",
      label: "File Path Or Url",
      description: "Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/example.pdf`)",
    },
    message: {
      propDefinition: [
        discord,
        "message",
      ],
    },
    userId: {
      propDefinition: [
        discord,
        "userId",
        (c) => ({
          guildId: c.guildId,
        }),
      ],
      description: "Select either an user or a channel",
      optional: true,
    },
    channelId: {
      propDefinition: [
        discord,
        "channelId",
        ({ guildId }) => ({
          guildId,
          notAllowedChannels: constants.NOT_ALLOWED_CHANNELS,
        }),
      ],
      description: "Select either a channel or an user",
      optional: true,
    },
    embeds: {
      propDefinition: [
        discord,
        "embeds",
      ],
    },
    threadID: {
      propDefinition: [
        discord,
        "threadID",
      ],
    },
    username: {
      propDefinition: [
        discord,
        "username",
      ],
    },
    avatarURL: {
      propDefinition: [
        discord,
        "avatarURL",
      ],
    },
    includeSentViaPipedream: {
      type: "boolean",
      optional: true,
      default: true,
      label: "Include link to workflow",
      description: "Defaults to `true`, includes a link to this workflow at the end of your Discord message.",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  methods: {
    appendPipedreamText(message) {
      let content = message;
      if (typeof content !== "string") {
        content = JSON.stringify(content);
      }
      content += `\n\n${this.getSentViaPipedreamText()}`;
      return content;
    },
    getSentViaPipedreamText() {
      const workflowId = process.env.PIPEDREAM_WORKFLOW_ID;
      // The link text is a URL without a protocol for consistency with the "Send via link" text in
      // Slack messages
      const linkText = `pipedream.com/@/${workflowId}?o=a&a=discord_webhook`;
      const link = `https://${linkText}`;
      return `Sent via [${linkText}](<${link}>)`;
    },
  },
  async run({ $ }) {
    if ((this.userId && this.channelId) || (!this.userId && !this.channelId)) {
      throw new ConfigurationError("You must select either an user or a channel.");
    }
    let channelId = this.channelId;
    if (this.userId) {
      const createDMChannelResponse = await this.discord.createDm({
        $,
        recipientId: this.userId,
      });
      channelId = createDMChannelResponse.id;
    }
    if (channelId) {
      const createMessageResponse = await this.discord.sendMessageWithFile({
        $,
        channelId: channelId,
        threadID: this.threadID,
        username: this.username,
        file: this.file,
        embeds: utils.parseObject(this.embeds),
        avatarURL: this.avatarURL,
        content: this.includeSentViaPipedream
          ? this.appendPipedreamText(this.message)
          : this.message,
      });
      $.export("$summary", "Message has been sent successfully");
      return createMessageResponse;
    } else {
      throw new Error("Could not create or retrieve the channel!");
    }
  },
};

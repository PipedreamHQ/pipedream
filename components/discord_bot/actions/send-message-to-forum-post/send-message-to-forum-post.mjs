import discord from "../../discord_bot.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "discord_bot-send-message-to-forum-post",
  name: "Send Message to Forum Post",
  description: "Send a message to a Discord forum. [See the documentation](https://discord.com/developers/docs/resources/channel#create-message)",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    discord,
    info: {
      type: "alert",
      alertType: "info",
      content: `
        \nTo get the Post ID:
        \n1. **Manually on Web** 
          - Select the Forum thread, them copy the **second** number from the URL. For example, if the URL is \`https://discord.com/channels/123/456\`, the Post ID is \`456\`.
        \n2. **Pipedream Source**
          - If you're using **Discord Bot - New Forum Thread Message** source, use the \`channel_id\` field from the event. 
      `,
    },
    postId: {
      type: "string",
      label: "Post ID",
      description: "The ID of a forum post",
    },
    message: {
      propDefinition: [
        discord,
        "message",
      ],
    },
    embeds: {
      propDefinition: [
        discord,
        "embeds",
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
  },
  methods: {
    getUserInputProps(omit = [
      "discord",
    ]) {
      return Object.keys(this)
        .filter((key) => typeof this[key] !== "function" && !omit.includes(key))
        .reduce((props, key) => {
          props[key] = this[key];
          return props;
        }, {});
    },
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
    const {
      postId,
      message,
      embeds,
      username,
      avatarURL,
      includeSentViaPipedream,
    } = this;
    try {
      const createMessageResponse = await this.discord.createMessage({
        $,
        channelId: postId,
        data: {
          embeds: utils.parseObject(embeds),
          avatarURL,
          username: username,
          content: includeSentViaPipedream
            ? this.appendPipedreamText(message)
            : message,
        },
      });
      $.export("$summary", "Message has been sent successfully");
      return createMessageResponse;
    } catch (err) {
      console.log(err);
      const unsentMessage = this.getUserInputProps();
      $.export("unsent", unsentMessage);
      throw err;
    }
  },
};

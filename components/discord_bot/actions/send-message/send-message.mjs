import common from "../../common.mjs";
import utils from "../../common/utils.mjs";

const { discord } = common.props;

export default {
  key: "discord_bot-send-message",
  name: "Send message",
  description: "Send message to an user. [See the docs here](https://discord.com/developers/docs/resources/user#create-dm) and [here](https://discord.com/developers/docs/resources/channel#create-message)",
  version: "0.0.1",
  type: "action",
  props: {
    discord,
    ...common.props,
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
    userId: {
      propDefinition: [
        discord,
        "userId",
        (c) => ({
          guildId: c.guildId,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
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
    const createDMChannelResponse = await this.discord.createDm({
      $,
      recipientId: this.userId,
    });
    if (createDMChannelResponse.id) {
      const createMessageResponse = await this.discord.createMessage({
        $,
        channelId: createDMChannelResponse.id,
        data: {
          embeds: utils.parseObject(this.embeds),
          avatarURL: this.avatarURL,
          threadID: this.threadID,
          username: this.username,
          content: this.includeSentViaPipedream
            ? this.appendPipedreamText(this.message)
            : this.message,
        },
      });
      $.export("$summary", "Message has been sent successfully");
      return createMessageResponse;
    } else {
      $.export("$summary", "Could not create or retrieve DM channel!");
      throw new Error("Create DM Channel call was not successful!");
    }
  },
};

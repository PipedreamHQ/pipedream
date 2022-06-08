import discord from "../discord_bot.app.mjs";

/* eslint-disable pipedream/required-properties-key, pipedream/required-properties-name,
  pipedream/required-properties-version, pipedream/required-properties-description */
export default {
  type: "action",
  props: {
    discord,
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
};

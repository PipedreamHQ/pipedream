import discord from "../../discord.app.mjs";

export default {
  props: {
    discord,
    channel: {
      type: "$.discord.channel",
      appProp: "discord",
    },
    message: {
      propDefinition: [
        discord,
        "message",
      ],
    },
    includeSentViaPipedream: {
      propDefinition: [
        discord,
        "includeSentViaPipedream",
      ],
    },
  },
  methods: {
    getUserInputProps(omit = [
      "discord",
    ]) {
      return Object.keys(this)
        .filter((k) => typeof this[k] !== "function" && !omit.includes(k))
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
      const linkText = `pipedream.com/@/${workflowId}?o=a&a=discord`;
      const link = `https://${linkText}`;
      return `Sent via [${linkText}](<${link}>)`;
    },
  },
};

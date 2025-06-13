import discord from "../../discord.app.mjs";
import constants from "./constants.mjs";

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
      propDefinition: [
        discord,
        "includeSentViaPipedream",
      ],
    },
    suppressNotifications: {
      propDefinition: [
        discord,
        "suppressNotifications",
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
      const baseLink = "https://pipedream.com";
      const linkText = !workflowId
        ? "Pipedream Connect"
        : "Pipedream";

      const link = !workflowId
        ? `${baseLink}/connect`
        : `${baseLink}/@/${encodeURIComponent(workflowId)}?o=a&a=discord`;

      return `Sent via [${linkText}](<${link}>)`;
    },
    getMessageFlags(suppressNotifications) {
      let flags = 0;
      if (suppressNotifications) flags += constants.SUPPRESS_NOTIFICATIONS;
      return flags;
    },
  },
};

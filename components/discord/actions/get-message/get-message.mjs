import discord from "../../discord.app.mjs";

export default {
  key: "discord-get-message",
  name: "Get Message",
  description: "Retrieves a specific message in the channel",
  version: "0.0.1",
  type: "action",
  props: {
    discord,
    channel: {
      type: "$.discord.channel",
      appProp: "discord",
    },
    message: {
      label: "Message ID",
      type: "string",
      async options({ channel }) {
        const messages = await this.discord.listMessages(channel);
        return messages?.map(({
          content, id,
        }) => ({
          label:
            content.length > 50
              ? content.slice(0, 45) + " [...]"
              : content,
          value: id,
        }));
      },
    },
  },
  async run({ $ }) {
    const resp = await this.discord.getMessage(this.message);
    $.export("$summary", "Message obtained successfully");
    return resp;
  },
};

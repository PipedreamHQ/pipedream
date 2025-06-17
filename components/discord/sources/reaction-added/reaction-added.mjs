import discord from "../../discord.app.mjs";

export default {
  key: "discord-reaction-added",
  name: "Reaction Added (Instant)",
  description: "Emit new event for each reaction added to a message",
  version: "0.0.4",
  type: "source",
  props: {
    discord,
    channels: {
      type: "$.discord.channel[]",
      appProp: "discord",
      label: "Channels",
      description: "Select the channel(s) you'd like to be notified for",
      optional: true,
    },
    discordApphook: {
      type: "$.interface.apphook",
      appProp: "discord",
      eventNames() {
        return this.channels?.length > 0
          ? this.channels.map((channel) => `MESSAGE_REACTION_ADD:${channel}`)
          : [
            "MESSAGE_REACTION_ADD",
          ];
      },
    },
  },
  async run(event) {
    this.$emit(event, {
      id: event.messageId,
      summary: `Reaction added to message ${event.messageId}`,
      ts: Date.now(),
    });
  },
};

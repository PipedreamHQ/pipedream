import discord from "../../discord.app.mjs";

export default {
  key: "discord-message-deleted",
  name: "Message Deleted (Instant)",
  description: "Emit new event for each message deleted",
  version: "0.0.4",
  dedupe: "unique",
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
          ? this.channels.map((channel) => `MESSAGE_DELETE:${channel}`)
          : [
            "MESSAGE_DELETE",
          ];
      },
    },
  },
  async run(event) {
    this.$emit(event, {
      id: event.id,
      summary: `Message ${event.id} deleted from ${event.channel}`,
      ts: Date.now(),
    });
  },
};

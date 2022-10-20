import discord from "../../discord.app.mjs";

export default {
  key: "discord-new-thread",
  name: "New Thread (Instant)",
  description: "Emit new event for each new thread created",
  version: "0.0.1",
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
          ? this.channels.map((channel) => `THREAD_CREATE:${channel}`)
          : [
            "THREAD_CREATE",
          ];
      },
    },
  },
  async run(event) {
    this.$emit(event, {
      id: event.id,
      summary: `New thread created with ID ${event.id}`,
      ts: Date.now(),
    });
  },
};

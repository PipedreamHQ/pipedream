import discord from "../../discord.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  type: "source",
  key: "discord-new-message",
  name: "New Message (Instant)",
  description: "Emit new event for each message posted to one or more channels in a Discord server",
  version: "1.0.4",

  dedupe: "unique",
  props: {
    discord,
    channels: {
      type: "$.discord.channel[]",
      appProp: "discord",
      label: "Channels",
      description: "Select the channel(s) you'd like to be notified for",
    },
    // eslint-disable-next-line pipedream/props-label,pipedream/props-description
    discordApphook: {
      type: "$.interface.apphook",
      appProp: "discord",
      async eventNames() {
        return this.channels || [];
      },
    },
  },
  async run(event) {
    if (event.guildID != this.discord.$auth.guild_id) {
      return;
    }
    this.$emit(event, {
      id: event.id,
    });
  },
  sampleEmit,
};

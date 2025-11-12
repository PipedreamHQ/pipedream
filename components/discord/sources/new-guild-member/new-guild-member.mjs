import discord from "../../discord.app.mjs";

export default {
  key: "discord-new-guild-member",
  name: "New Guild Member (Instant)",
  description: "Emit new event for each new member added to a guild",
  version: "0.0.4",
  dedupe: "unique",
  type: "source",
  props: {
    discord,
    discordApphook: {
      type: "$.interface.apphook",
      appProp: "discord",
      eventNames: [
        "GUILD_MEMBER_ADD",
      ],
    },
  },
  async run(event) {
    this.$emit(event, {
      id: `${event.userId}${event.guildId}`,
      summary: `Member ${event.displayName} added`,
      ts: Date.now(),
    });
  },
};

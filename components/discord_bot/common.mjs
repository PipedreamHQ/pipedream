import discord from "./discord_bot.app.mjs";

export default {
  props: {
    discord,
    guildId: {
      propDefinition: [
        discord,
        "guild",
      ],
    },
  },
};

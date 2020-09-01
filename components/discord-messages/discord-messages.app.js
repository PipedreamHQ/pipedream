module.exports = {
  type: "app",
  app: "discord_messages",
  propDefinitions: {
  },
  methods: {
    async _makeRequest(opts) {
      if (!opts.headers) opts.headers = {};
      opts.headers.authorization = `Bot ${this.$auth.bot_token}`;
      opts.headers["user-agent"] = "@PipedreamHQ/pipedream v0.1";
      const { path } = opts;
      delete opts.path;
      opts.url = `https://discordapp.com/api${
      path[0] === "/" ? "" : "/"
    }${path}`;
      return await require("@pipedreamhq/platform").axios(this, opts);
    },
    async getChannels(guildID) {
      const channels = await this._makeRequest({
        path: `/guilds/${guildID}/channels`,
      });
      // Don't display GUILD_CATEGORY channels and GUILD_VOICE channels
      // https://discord.com/developers/docs/resources/channel#channel-object-channel-types
      return channels
        .filter((channel) => channel.type != 4 && channel.type != 2)
        .map((channel) => {
          return {
            label: channel.name,
            value: channel.id,
          };
        });
    },
  },
}

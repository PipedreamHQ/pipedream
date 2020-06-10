module.exports = {
  type: "app",
  app: "discord_bot",
  propDefinitions: {
    guild: {
      type: "string",
      label: "Guild",
      description: "Discord Guild where your channel lives",
      async options() {
        return await this.getGuilds();
      },
    },
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
    async getGuilds() {
      const guilds = await this._makeRequest({
        path: `/users/@me/guilds`,
      });
      return guilds.map((guild) => {
        return {
          label: guild.name,
          value: guild.id,
        };
      });
    },
    async getChannels(guildID) {
      const channels = await this._makeRequest({
        path: `/guilds/${guildID}/channels`,
      });
      return channels.map((channel) => {
        return {
          label: channel.name,
          value: channel.id,
        };
      });
    },
    async getMessagesSinceID(channelID, after) {
      return await this._makeRequest({
        path: `/channels/${channelID}/messages`,
        params: {
          after,
        },
      });
    },
    async getLastMessageID(channelID) {
      const messages = await this._makeRequest({
        path: `/channels/${channelID}/messages`,
        params: {
          limit: 1,
        },
      });
      return messages.length ? messages[0].id : 1;
    },
  },
};

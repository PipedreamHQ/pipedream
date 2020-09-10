module.exports = {
  type: "app",
  app: "discord_messages_non_manager",
  propDefinitions: {
  },
  methods: {
    async _makeRequest(opts) {
      if (!opts.headers) opts.headers = {}
      opts.headers.Authorization = `Bearer ${this.$auth.oauth_access_token}`
      opts.headers["user-agent"] = "@PipedreamHQ/pipedream v0.1"
      const { path } = opts
      delete opts.path
      opts.url = `https://discord.com/api${
        path[0] === "/" ? "" : "/"
      }${path}`
      return await require("@pipedreamhq/platform").axios(this, opts)
    },
    async getGuilds() {
      const guilds = await this._makeRequest({
        path: '/users/@me/guilds',
      })
      return guilds
        .map((guild) => {
          return {
            label: guild.name,
            value: guild.id,
          }
        })
    },
  },
}

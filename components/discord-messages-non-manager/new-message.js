const discord = require("https://github.com/PipedreamHQ/pipedream/components/discord-messages-non-manager/discord-messages-non-manager.app.js")

module.exports = {
  name: 'instant discord message',
  version: '0.0.1',
  props: {
    discord,
    guild: {
      type: "string",
      label: "Guild",
      description: "Select the guild you'd like to be notified for",
      async options() {
        return this.discord.getGuilds()
      },
    },
    channels: {
      type: "$.discord.channels",
      appProp: "discord",
      guildProp: "guild",
      label: "Channels",
      description: "Select the channels you'd like to be notified for",
    },
    discordApphook: {
      type: "$.interface.apphook",
      appProp: "discord",
      async eventNames() {
        return this.channels || []
      },
    },
  },
  async run(event) {
    this.$emit(event)
  },
}

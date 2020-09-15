const discord = require("https://github.com/PipedreamHQ/pipedream/components/discord-messages-non-manager/discord-messages-non-manager.app.js")

module.exports = {
  name: 'instant discord message',
  version: '0.0.2',
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
      type: "$.discord.channel[]",
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
    ignoreMyself: {
      type: "boolean",
      label: "Ignore myself",
      description: "Ignore messages from me",
      default: true,
    },
  },
  async run(event) {
    if (this.ignoreMyself && event.authorID == this.discord.$auth.oauth_uid) {
      return
    }
    this.$emit(event)
  },
}

const discord = require("https://github.com/PipedreamHQ/pipedream/components/discord/discord.app.js")

module.exports = {
  name: 'new discord message',
  version: '0.0.1',
  dedupe: "unique",
  props: {
    discord,
    channels: {
      type: "$.discord.channel[]",
      appProp: "discord",
      label: "Channels",
      description: "Select the channel()s you'd like to be notified for",
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
    if (event.guildID != this.discord.$auth.guild_id) {
      return
    }
    if (this.ignoreMyself && event.authorID == this.discord.$auth.oauth_uid) {
      return
    }
    this.$emit(event)
  },
}

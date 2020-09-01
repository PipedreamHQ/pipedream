const discord = require("https://github.com/PipedreamHQ/pipedream/components/discord-messages/discord-messages.app.js")

module.exports = {
  name: 'instant discord message',
  version: '0.0.5',
  props: {
    discord,
    discordApphook: {
      type: "$.interface.apphook",
      appProp: "discord",
      async eventNames() {
        return this.channels || []
      },
    },
    channels: {
      type: "string[]",
      label: "Channels",
      description: "The channels you'd like to watch for new messages",
      async options() {
        return await this.discord.getChannels()
      },
    },
  },
  async run(event) {
    this.$emit(event)
  },
}

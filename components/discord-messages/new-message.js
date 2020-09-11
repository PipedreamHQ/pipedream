const discord = require("https://github.com/PipedreamHQ/pipedream/components/discord-messages/discord-messages.app.js")

module.exports = {
  name: 'instant discord message',
  version: '0.0.6',
  props: {
    discord,
    channels: {
      type: "$.discord.channel[]",
      appProp: "discord",
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

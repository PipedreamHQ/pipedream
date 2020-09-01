const discord = require("https://github.com/PipedreamHQ/pipedream/components/discord-messages/discord-messages.app.js")

module.exports = {
  name: 'instant discord message',
  version: '0.0.2',
  props: {
    discord,
    discordApphook: {
      type: "$.interface.apphook",
      appProp: "discord",
      async eventNames() {
        return []
      },
    },
  },
  async run(event) {
    this.$emit(event)
  },
}

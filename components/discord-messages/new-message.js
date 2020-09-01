const discord = require("https://github.com/PipedreamHQ/pipedream/components/discord-messages/discord-messages.app.js")

module.exports = {
  name: 'instant discord messages',
  version: '0.0.1',
  props: {
    discord,
  },
  async run(event) {
    this.$emit(event)
  },
}

const discord = require("https://github.com/PipedreamHQ/pipedream/components/discord/discord-messages.app.js")

module.exports = {
  name: '',
  version: '',
  props: {
    discord,
  },
  async run(event) {
    this.$emit(event)
  },
}

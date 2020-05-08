const gorgias = require('https://github.com/PipedreamHQ/pipedream/components/gorgias/gorgias.app.js')
const axios = require('axios')

module.exports = {
  name: "new-events",
  version: "0.0.1",
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    gorgias,
  },
 
  async run(event) {
    auth: {
      username: `${auths.gorgias.email}`,
      password: `${auths.gorgias.api_key}`,
    const url = `https://pipedream.gorgias.com/api/events/`
    const data = (await axios.get(url)).data
    this.$emit(data)
  },

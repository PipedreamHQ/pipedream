const gorgias = require('https://github.com/PipedreamHQ/pipedream/components/gorgias/gorgias.app.js')
const moment = require('moment')

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
  dedupe: "greatest",
  async run(event) {
    const url = `https://${this.gorgias.$auth.domain}.gorgias.com/api/events/?per_page=100`
    const data = (await axios({
      method: "get",
      url,
      auth: {
        username: `${this.gorgias.$auth.email}`,
        password: `${this.gorgias.$auth.api_key}`,
      },
    })).data
   data.data.forEach(gorgias_event=>{
     this.$emit(gorgias_event,{
       id: gorgias_event.id,
       ts: moment(gorgias_event.created_datetime).valueOf(),     
       summary: gorgias_event.type,
     })
   }) 
  },
}

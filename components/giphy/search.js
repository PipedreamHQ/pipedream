const giphy = {
  type: "app",
  app: "giphy",
}
const axios = require('axios')
module.exports = {
  name: "find_gif",
  version: "0.0.1",
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    keyword: "string",
    giphy,
  },
  async run(event) {
    const giphy_event = (await axios({
      method: "get",
      url: `http://api.giphy.com/v1/gifs/random`,
      params: {
        rating: "g",
        tag: this.keyword,
        api_key: this.giphy.$auth.api_key,
      }
    })).data
    this.$emit(giphy_event,{       
     id: giphy_event.data.id,
     summary: giphy_event.data.title,
    })    
  },
}

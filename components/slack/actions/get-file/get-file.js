const slack = require('../../slack.app.js')
const { WebClient } = require('@slack/web-api')

module.exports = {  
  key: "slack-get-file",
  name: "Get File",
  description: "Return information about a file",
  version: "0.0.35",
  type: "action",
  props: {
    slack,
    file: { propDefinition: [ slack, "file" ] },
    count: { propDefinition: [ slack, "count" ] },
  },
  async run() {
    const web = new WebClient(this.slack.$auth.oauth_access_token)
    return await web.files.info({
        file: this.file,
        count: this.count
    })
  },
}
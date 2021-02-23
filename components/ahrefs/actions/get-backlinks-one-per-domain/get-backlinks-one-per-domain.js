const ahrefs = require('../../ahrefs.app.js')
const axios = require('axios')

module.exports = {
  name: 'Get Backlinks One Per Domain',
  key: "ahrefs-get-backlinks-one-per-domain",
  version: '0.0.3',
  type: "action",
  props: {
    ahrefs,
    target: { propDefinition: [ahrefs, "target"] },
    mode: { propDefinition: [ahrefs, "mode"] },
    limit: { propDefinition: [ahrefs, "limit"] },
  },
  async run() {
    return (await axios({
      url: `https://apiv2.ahrefs.com`,
      params: {
        token: this.ahrefs.$auth.oauth_access_token,
        from: "backlinks_one_per_domain",
        target: this.target,
        mode: this.mode,
        limit: this.limit,
        order_by: "ahrefs_rank:desc",
        output: "json"
      },
    })).data
  },
}
const axios = require('axios')
const querystring = require('querystring')
const resourceTypes = ['labels','projects','items','notes','sections','filters','reminders','locations','user','live_notifications','collaborators','user_settings','notification_settings'].sort()

module.exports = {
  type: "app",
  app: "todoist",
  propDefinitions: {
    includeResourceTypes: {
      type: "string[]",
      label: "Resource Types",
      description: "Select one or more resources to include",
      async options() {
        resourceTypes.unshift('all')
        return resourceTypes
      },
    },
    excludeResourceTypes: {
      type: "string[]",
      label: "Excluded Resource Type",
      description: "Select one or more resources to exclude",
      optional: true,
      options: resourceTypes,
    },
  },
  methods: {
    async _makeRequest(opts) {
      const { path } = opts
      delete opts.path
      opts.url = `https://api.todoist.com${path[0] === "/" ? "" : "/"}${path}`
      opts.payload.token = this.$auth.oauth_access_token
      opts.data = querystring.stringify(opts.payload)
      delete opts.payload
      console.log(opts)
      return await axios(opts)
    },
    async sync(opts) {      
      return (await this._makeRequest({
        path: `/sync/v8/sync`,
        method: 'POST',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        payload: opts
      })).data
    },
  }
}

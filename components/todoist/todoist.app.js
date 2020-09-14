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
    selectProjects: {
      type: "integer[]",
      label: "Select Projects",
      description: "Filter for events that match one or more projects. Leave this blank to emit results for any project.",
      optional: true,
      async options() {
        // write any node code that returns a string[] or object[] (with label/value keys)
        return (await this.getProjects()).map(project => { 
          return { label: project.name, value: project.id } 
        }) 
      },
    }
  },
  methods: {
    async _makeSyncRequest(opts) {
      const { path } = opts
      delete opts.path
      opts.url = `https://api.todoist.com${path[0] === "/" ? "" : "/"}${path}`
      opts.payload.token = this.$auth.oauth_access_token
      opts.data = querystring.stringify(opts.payload)
      delete opts.payload
      return await axios(opts)
    },
    async _makeRestRequest(opts) {
      const { path } = opts
      delete opts.path
      opts.url = `https://api.todoist.com${path[0] === "/" ? "" : "/"}${path}`
      opts.headers = {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`
      }
      return await axios(opts)
    },
    async isProjectInList(project_id, selectedProjectIds) {
      console.log(project_id)
      console.log(selectedProjectIds)
      if (selectedProjectIds.length > 0) {
        if(selectedProjectIds.includes(project_id)) {
          return true
        } else {
          return false
        }
      } else {
        return true
      }  
    },
    async sync(opts) {      
      return (await this._makeSyncRequest({
        path: `/sync/v8/sync`,
        method: 'POST',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        payload: opts
      })).data
    },
    async getProjects() {      
      return (await this._makeRestRequest({
        path: `/rest/v1/projects`,
        method: 'GET',
      })).data
    },
  }
}

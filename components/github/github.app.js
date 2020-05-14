const axios = require("axios")
const WEBHOOKS = require("@octokit/webhooks-definitions")
const listOfEvents = WEBHOOKS.map(webhook => webhook.name)

module.exports = {
  type: "app",
  app: "github",
  propDefinitions: {
    repoFullName: {
      type: "string",
      label: "Repo",
      async options({ page }) {
        const repos = await this.getRepos({
          page: page + 1, // pipedream page 0-indexed, github is 1
        })
        return repos.map(repo => repo.full_name)
      },
    },
    events: {
      type: "string[]",
      label: "Events",
      options: listOfEvents,
    },
  },
  methods: {
    async _makeRequest(opts) {
      if (!opts.headers) opts.headers = {}
      opts.headers.authorization = `token ${this.$auth.oauth_access_token}`
      opts.headers["user-agent"] = "@PipedreamHQ/pipedream v0.1"
      const { path } = opts
      delete opts.path
      opts.url = `https://api.github.com${path[0] === "/" ? "" : "/"}${path}`
      return await axios(opts)
    },
    async getRepos({ page }) {
      return (await this._makeRequest({
        path: "/user/repos",
        params: {
          per_page: 100,
          page,
        },
      })).data
    },
    async createHook({ repoFullName, endpoint, events, secret }) {
      return (await this._makeRequest({
        method: "post",
        path: `/repos/${repoFullName}/hooks`,
        data: {
          name: "web",
          config: {
            url: endpoint,
            content_type: "json",
            secret,
          },
          events,
        },
      })).data
    },
    async deleteHook({ repoFullName, hookId }) {
      return (await this._makeRequest({
        method: "delete",
        path: `/repos/${repoFullName}/hooks/${hookId}`,
      })).data
    },
  },
}

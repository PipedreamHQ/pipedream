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
    org: {
      type: "string",
      label: "Organization",
      async options({ page }) {
        const orgs = await this.getOrgs({
          page: page + 1, // pipedream page 0-indexed, github is 1
        })
        return orgs.map(org => org.login)
      },
      optional: true,
    },
    branch: {
      type: "string",
      label: "Branch",
      async options({ page, repoFullName }) {
        const branches = await this.getBranches({
          page: page + 1, // pipedream page 0-indexed, github is 1
          repoFullName,
        })
        return branches.map(branch => branch.name)
      },
      optional: true,
    },
    events: {
      type: "string[]",
      label: "Events",
      options: listOfEvents,
    },
    labels: {
      type: "string[]",
      label: "Labels",
      async options({ page, repoFullName }) {
        const labels = await this.getLabels({
          page: page + 1, // pipedream page 0-indexed, github is 1
          repoFullName,
        })
        return labels.map(label => {
          return {
            label: label.name,
            value: label.id,
          }
        })
      },
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
    async generateSecret() {
      return "" + Math.random();
    },
    async getBranches(opts) {
      const {
        page,
        repoFullName,
      } = opts
      return (await this._makeRequest({
        path: `/repos/${repoFullName}/branches`,
        params: {
          per_page: 100,
          page,
        },
      })).data
    },
    async getCommits(opts) {
      const {
        repoFullName,
        sha,
        page,
      } = opts
      return (await this._makeRequest({
        path: `/repos/${repoFullName}/commits`,
        params: {
          per_page: 100,
          sha,
          page,
        },
      })).data
    },
    async getLabels(opts) {
      const {
        repoFullName,
        page,
      } = opts
      return (await this._makeRequest({
        path: `/repos/${repoFullName}/labels`,
        params: {
          per_page: 100,
          page,
        },
      })).data
    },
    async getReleases(opts) {
      const {
        repoFullName,
        ifModifiedSince,
      } = opts
      const config = {
        path: `/repos/${repoFullName}/tags`,
        params: {
          per_page: 100,
        },
      }
      if (ifModifiedSince) {
        if(!config.headers) {
          config.headers = {}
        }
        config.headers["If-Modified-Since"] = ifModifiedSince
      }
      return (await this._makeRequest(config))
    },
    async getOrgs(opts = {}) {
      const {
        page,
      } = opts
      return (await this._makeRequest({
        path: "/user/orgs",
        params: {
          per_page: 100,
          page,
        },
      })).data
    },
    async getRepos(opts = {}) {
      const {
        page,
        org,
      } = opts
      return (await this._makeRequest({
        path: org ? `/orgs/${org}/repos` : '/user/repos',
        params: {
          per_page: 100,
          page,
        },
      })).data
    },
    async getTeams(opts = {}) {
      const {
        page,
      } = opts
      return (await this._makeRequest({
        path: "/user/teams",
        params: {
          per_page: 100,
          page,
        },
      })).data
    },
    async getUser(opts = {}) {
      return (await this._makeRequest({
        path: "/user",
      })).data
    },
    async getNotifications(opts = {}) {
      const {
        all = true,
        participating = false,
        since,
        before,
        page,
      } = opts

      return (await this._makeRequest({
        path: "/notifications",
        params: {
          per_page: 100,
          page,
          all,
          participating,
          since,
          before,
        },
      })).data
    },
    async getUrl(opts = {}) {
      const {
        url,
      } = opts

      return (await this._makeRequest({
        path: url.replace('https://api.github.com',''),
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

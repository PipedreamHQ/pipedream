const { WebClient } = require('@slack/web-api')

module.exports = {
  type: "app",
  app: "slack",
  methods: {
    sdk() {
      return new WebClient(this.$auth.oauth_access_token)
    },
    async getScopes() {
      try {
        const info = await this.sdk().auth.test()
        if (info.ok) {
          return info.response_metadata.scopes
        }
      } catch(err) {
        console.log("Error getting scopes", err)
      }
    },
    async getChannels(cursor) {
      try {
        const types = ["public_channel"]
        const scopes = await this.getScopes()
        if (scopes.includes("groups:read")) {
          types.push("private_channel")
        }
        if (scopes.includes("mpim:read")) {
          types.push("mpim")
        }
        if (scopes.includes("im:read")) {
          types.push("im")
        }
        const params = {
          cursor,
          exclude_archived: true,
          limit: 10,
          types: types.join(),
          user: this.$auth.oauth_uid,
        }
        const response = await this.sdk().users.conversations(params)
        return {
          options: response.channels.map((c) => {
            return { label: c.name, value: c.id }
          }),
          context: { cursor: response.response_metadata.next_cursor },
        }
      } catch(err) {
        console.log("Error getting channels", err)
      }
    },
  },
}

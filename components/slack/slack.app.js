const { WebClient } = require('@slack/web-api')

module.exports = {
  type: "app",
  app: "slack",
  methods: {
    mySlackId() {
      return this.$auth.oauth_uid
    },
    sdk() {
      return new WebClient(this.$auth.oauth_access_token)
    },
    async scopes() {
      const resp = await this.sdk().auth.test()
      if (resp.ok) {
        return resp.response_metadata.scopes
      } else {
        console.log("Error getting scopes", resp.error)
        throw(resp.error)
      }
    },
    async availableConversations(types, cursor) {
      const params = {
        types,
        cursor,
        limit: 10,
        exclude_archived: true,
        user: this.$auth.oauth_uid,
      }
      const resp = await this.sdk().users.conversations(params)
      if (resp.ok) {
        return { cursor: resp.response_metadata.next_cursor, conversations: resp.channels }
      } else {
        console.log("Error getting conversations", resp.error)
        throw(resp.error)
      }
    },
    async users(cursor) {
      const resp = await this.sdk().users.list({ cursor })
      if (resp.ok) {
        return { users: resp.members, cursor: resp.response_metadata.next_cursor }
      } else {
        console.log("Error getting users", resp.error)
        throw(resp.error)
      }
    },
  },
}

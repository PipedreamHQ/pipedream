const common = require("../common-webhook.js");

module.exports = {
  ...common,
  name: "Followed Streams (Instant)",
  key: "twitch-followed-streams",
  description: "Emits an event when a followed stream is live.",
  version: "0.0.1",
  methods: {
    ...common.methods,
    async getTopics() {
      // get the authenticated user
      const { data: authenticatedUserData } = await this.twitch.getUsers();
      const params = {
        from_id: authenticatedUserData[0].id,
      };
      const topics = this.paginate(
        this.twitch.getUserFollows.bind(this),
        params,
        "webhook"
      );
      return topics;
    },
    getTopicString(followed) {
      return `streams?user_id=${followed.to_id}`;
    },
    getMeta(data, headers) {
      const { started_at: startedAt, title: summary } = data[0];
      const ts = new Date(startedAt).getTime();
      return {
        id: headers["twitch-notification-id"],
        summary,
        ts,
      };
    },
  },
};
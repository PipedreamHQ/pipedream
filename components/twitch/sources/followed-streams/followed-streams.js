const common = require("../common-webhook.js");

module.exports = {
  ...common,
  name: "Followed Streams (Instant)",
  key: "twitch-followed-streams",
  description: "Emits an event when a followed stream is live.",
  version: "0.0.2",
  methods: {
    ...common.methods,
    async getTopics() {
      // get the authenticated user
      const { data: authenticatedUserData } = await this.twitch.getUsers();
      const params = {
        from_id: authenticatedUserData[0].id,
      };
      const items = await this.paginate(
        this.twitch.getUserFollows.bind(this),
        params
      );
      const topics = [];
      for await (const item of items) {
        topics.push(this.getTopicString(item));
      }
      return topics;
    },
    getTopicString(followed) {
      return `streams?user_id=${followed.to_id}`;
    },
    getMeta(item, headers) {
      const { started_at: startedAt, title: summary } = item;
      const ts = new Date(startedAt).getTime();
      return {
        id: headers["twitch-notification-id"],
        summary,
        ts,
      };
    },
  },
};

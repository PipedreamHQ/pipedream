const common = require("../common-webhook.js");

module.exports = {
  ...common,
  name: "New Follower (Instant)",
  key: "twitch-new-follower",
  description: "Emits an event when a new user follows your channel.",
  version: "0.0.2",
  methods: {
    ...common.methods,
    async getTopics() {
      // get the authenticated user
      const { data } = await this.twitch.getUsers();
      return [`users/follows?first=1&to_id=${data[0].id}`];
    },
    getMeta(item, headers) {
      const { followed_at: followedAt, from_name: summary } = item;
      const ts = new Date(followedAt).getTime();
      return {
        id: headers["twitch-notification-id"],
        summary,
        ts,
      };
    },
  },
};

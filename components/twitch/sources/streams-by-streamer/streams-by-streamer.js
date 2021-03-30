const common = require("../common-webhook.js");
const twitch = require("../../twitch.app.js");

module.exports = {
  ...common,
  name: "Streams By Streamer (Instant)",
  key: "twitch-streams-by-streamer",
  description:
    "Emits an event when a live stream starts from the streamers you specify.",
  version: "0.0.2",
  props: {
    ...common.props,
    streamerLoginNames: { propDefinition: [twitch, "streamerLoginNames"] },
  },
  methods: {
    ...common.methods,
    async getTopics() {
      const topics = [];
      // get the user ids of the specified streamers
      const { data } = await this.twitch.getUsers(this.streamerLoginNames);
      if (data.length == 0) {
        console.log(
          `No streamers found with the name(s) ${this.streamerLoginNames}`
        );
        return [];
      }
      for (streamer of data) {
        topics.push(`streams?user_id=${streamer.id}`);
      }
      return topics;
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

const common = require("../common-polling.js");
const twitch = require("../../twitch.app.js");

module.exports = {
  ...common,
  name: "New Videos",
  key: "twitch-new-videos",
  description:
    "Emits an event when there is a new video from channels you follow.",
  version: "0.0.1",
  props: {
    ...common.props,
    max: { propDefinition: [twitch, "max"] },
  },
  methods: {
    ...common.methods,
    getMeta({ id, title: summary, created_at: createdAt }) {
      const ts = new Date(createdAt).getTime();
      return {
        id,
        summary,
        ts,
      };
    },
  },
  async run() {
    // get the authenticated user
    const { data: authenticatedUserData } = await this.twitch.getUsers();
    const params = {
      from_id: authenticatedUserData[0].id,
    };
    // get the channels followed by the authenticated user
    const followedUsers = await this.paginate(
      this.twitch.getUserFollows.bind(this),
      params
    );

    // get and emit new videos from each followed user
    let count = 0;
    for await (const followed of followedUsers) {
      const videos = await this.paginate(
        this.twitch.getVideos.bind(this),
        {
          user_id: followed.to_id,
          period: "day", // Period during which the video was created. Valid values: "all", "day", "week", "month".
        },
        this.max
      );
      for await (const video of videos) {
        this.$emit(video, this.getMeta(video));
        count++;
        if (count >= this.max) return;
      }
    }
  },
};
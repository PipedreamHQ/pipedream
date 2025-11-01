import common from "../common-polling.mjs";

export default {
  ...common,
  name: "New Followed Streams",
  key: "twitch-followed-streams",
  description: "Emit new event when a followed stream is live.",
  version: "0.1.3",
  type: "source",
  methods: {
    ...common.methods,
    getMeta(item) {
      const {
        id, started_at: startedAt,
        title: summary,
      } = item;
      const ts = new Date(startedAt).getTime();
      return {
        id,
        summary,
        ts,
      };
    },
  },
  hooks: {
    async deploy() {
      // get the authenticated user
      const { data: authenticatedUserData } = await this.twitch.getUsers();
      this.db.set("authenticatedUserId", authenticatedUserData[0].id);
    },
  },
  async run() {
    const params = {
      from_id: this.db.get("authenticatedUserId"),
    };
    // get the user_ids of the streamers followed by the authenticated user
    const follows = await this.paginate(
      this.twitch.getUserFollows.bind(this),
      params,
    );
    const followedIds = [];
    for await (const follow of follows) {
      followedIds.push(follow.to_id);
    }
    // get and emit streams for the followed streamers
    const streams = await this.paginate(this.twitch.getStreams.bind(this), {
      user_id: followedIds,
    });
    for await (const stream of streams) {
      this.$emit(stream, this.getMeta(stream));
    }
  },
};

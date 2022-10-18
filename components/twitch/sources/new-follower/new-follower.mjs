import common from "../common-polling.mjs";

export default {
  ...common,
  name: "New Follower (Instant)",
  key: "twitch-new-follower",
  description: "Emit new event when a new user follows your channel.",
  type: "source",
  version: "0.0.4",
  methods: {
    ...common.methods,
    async getTopics() {
      // get the authenticated user
      const { data } = await this.twitch.getUsers();
      return [
        `users/follows?first=1&to_id=${data[0].id}`,
      ];
    },
    getMeta(item) {
      const {
        from_id, to_id, followed_at, from_name,
      } = item;

      return {
        id: from_id + to_id + followed_at,
        summary: `${from_name} is a new follower`,
        ts: new Date(followed_at).getTime(),
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
    const follows = this.paginate(
      this.twitch.getUserFollows.bind(this),
      params,
    );

    for await (const follow of follows) {
      this.$emit(follow, this.getMeta(follow));
    }
  },
};

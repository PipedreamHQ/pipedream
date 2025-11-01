import common from "../common-polling.mjs";

export default {
  ...common,
  name: "New Follower",
  key: "twitch-new-follower",
  description: "Emit new event when a new user follows your channel.",
  type: "source",
  version: "0.1.3",
  methods: {
    ...common.methods,
    getMeta(item) {
      const {
        user_id, followed_at, user_name,
      } = item;

      return {
        id: user_id + followed_at,
        summary: `${user_name} is a new follower`,
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
      broadcaster_id: this.db.get("authenticatedUserId"),
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

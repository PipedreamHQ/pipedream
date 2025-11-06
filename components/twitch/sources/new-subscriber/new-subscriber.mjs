import common from "../common-polling.mjs";

export default {
  ...common,
  name: "New Subscriber",
  key: "twitch-new-subscriber",
  description: "Emit new event when a new user subscribes to your channel.",
  type: "source",
  version: "0.1.2",
  methods: {
    ...common.methods,
    getMeta(item) {
      const {
        user_id,
        user_name,
      } = item;

      const ts = new Date.now();

      return {
        id: user_id + ts,
        summary: `${user_name} is a new subscriber`,
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
      broadcaster_id: this.db.get("authenticatedUserId"),
    };
    // get subscribers to the authenticated user's channel
    const subscriptions = this.paginate(
      this.twitch.getBroadcasterSubscriptions.bind(this),
      params,
    );

    for await (const subscription of subscriptions) {
      this.$emit(subscription, this.getMeta(subscription));
    }
  },
};

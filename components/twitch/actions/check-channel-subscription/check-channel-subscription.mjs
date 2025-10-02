import common from "../common.mjs";

export default {
  ...common,
  name: "Check Channel Subscription",
  key: "twitch-check-channel-subscription",
  description: "Checks if you are subscribed to the specified user's channel",
  version: "0.1.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    user: {
      propDefinition: [
        common.props.twitch,
        "user",
      ],
      description: "User ID of the channel to check for a subscription to",
    },
  },
  async run() {
    // get the userID of the authenticated user
    const userId = await this.getUserId();
    const params = {
      broadcaster_id: this.user,
      user_id: userId,
    };
    try {
      return (await this.twitch.checkUserSubscription(params)).data.data;
    } catch (err) {
      // if no subscription is found, a 404 error is returned
      if (err.message.includes("404"))
        return `${userId} has no subscription to ${this.user}`;
      return err;
    }
  },
};

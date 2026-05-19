import common from "../common.mjs";

export default {
  ...common,
  name: "Check Channel Subscription",
  key: "twitch-check-channel-subscription",
  description: "Checks if you are subscribed to the specified broadcaster's channel. [See the documentation](https://dev.twitch.tv/docs/api/reference/#check-user-subscription)",
  version: "0.1.4",
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
      label: "Broadcaster",
      description: "The broadcaster's Twitch channel to check. Accepts a numeric user ID or login name.",
    },
  },
  async run({ $ }) {
    const userId = await this.getUserId();
    const broadcasterId = await this.twitch.resolveUserId(this.user);
    const params = {
      broadcaster_id: broadcasterId,
      user_id: userId,
    };
    try {
      const subscription = (await this.twitch.checkUserSubscription(params)).data.data;
      $.export("$summary", `User ${userId} is subscribed to broadcaster ${broadcasterId}`);
      return subscription;
    } catch (err) {
      // if no subscription is found, a 404 error is returned
      if (err.response?.status === 404) {
        const message = `User ${userId} has no subscription to broadcaster ${broadcasterId}`;
        $.export("$summary", message);
        return message;
      }
      throw err;
    }
  },
};

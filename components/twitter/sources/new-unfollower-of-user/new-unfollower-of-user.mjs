import base from "../new-unfollower-of-me/new-unfollower-of-me.mjs";

export default {
  ...base,
  key: "twitter-new-unfollower-of-user",
  name: "New Unfollower of User",
  description: "Emit new event when a specific user loses a follower on Twitter",
  version: "0.0.9",
  type: "source",
  props: {
    ...base.props,
    screenName: {
      propDefinition: [
        base.props.twitter,
        "screenName",
      ],
    },
  },
  methods: {
    ...base.methods,
    getScreenName() {
      return this.screenName;
    },
  },
};

const base = require("../new-unfollower-of-me/new-unfollower-of-me");

module.exports = {
  ...base,
  key: "twitter-new-unfollower-of-user",
  name: "New Unfollower of User",
  description: "Emit an event when a specific user loses a follower on Twitter",
  version: "0.0.3",
  props: {
    ...base.props,
    screen_name: {
      propDefinition: [
        base.props.twitter,
        "screen_name",
      ], 
    },
  },
  methods: {
    ...base.methods,
    getScreenName() {
      return this.screen_name;
    },
  },
};

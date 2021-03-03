const base = require("../new-follower-of-me/new-follower-of-me");

module.exports = {
  ...base,
  key: "twitter-new-follower-of-user",
  name: "New Follower of User",
  description: "Emit an event when a specific user gains a follower",
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

const common = require("../common-followers");

module.exports = {
  ...common,
  key: "twitter-new-unfollower-of-user",
  name: "New Unfollower of User",
  description: "Emit an event when a specific user loses a follower on Twitter",
  version: "0.0.2",
  props: {
    ...common.props,
    screen_name: { propDefinition: [common.props.twitter, "screen_name"] },
  },
  methods: {
    ...common.methods,
    getScreenName() {
      return this.screen_name;
    },
    getRelevantIds() {
      return this.getUnfollowers();
    },
  },
};

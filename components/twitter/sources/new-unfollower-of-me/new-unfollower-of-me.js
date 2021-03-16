const common = require("../common-followers");

module.exports = {
  ...common,
  key: "twitter-new-unfollower-of-me",
  name: "New Unfollower of Me",
  description: "Emit an event when a user unfollows you on Twitter",
  version: "0.0.3",
  methods: {
    ...common.methods,
    getRelevantIds() {
      return this.getUnfollowers();
    },
  },
};

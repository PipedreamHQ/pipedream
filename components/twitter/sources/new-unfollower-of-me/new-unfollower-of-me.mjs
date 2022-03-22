import common from "../common/followers.mjs";

export default {
  ...common,
  key: "twitter-new-unfollower-of-me",
  name: "New Unfollower of Me",
  description: "Emit new event when a user unfollows you on Twitter",
  version: "0.0.9",
  type: "source",
  methods: {
    ...common.methods,
    getRelevantIds() {
      return this.getUnfollowers();
    },
  },
};

const common = require("../common-followers");

module.exports = {
  ...common,
  key: "twitter-new-follower-of-me",
  name: "New Follower of Me",
  description: "Emit an event when a user follows you on Twitter",
  version: "0.0.3",
  props: {
    ...common.props,
    followersCacheSize: {
      type: "integer",
      label: "Followers Cache Size",
      description: "The maximum amount of follower ID's that will be cached at any given time",
      min: 10,
      max: 100,
      default: 100,
    },
  },
  methods: {
    ...common.methods,
    getFollowersCacheSize() {
      return this.followersCacheSize;
    },
    async getRelevantIds() {
      const isFirstExecution = !this.db.get("hasExecuted");
      const mostRecentFollowers = this.db.get("followers");
      if (isFirstExecution) {
        this.db.set("hasExecuted", true);

        // The first time this event source is executed, it will emit an event
        // for the most recent followers.
        // We reverse the list of new followers so that the event source emits the
        // events for each follower in the same order that the followers followed
        // the account, from least to most recent.
        return mostRecentFollowers.reverse();
      }

      const newFollowersGen = this.scanNewFollowers(mostRecentFollowers);
      const newFollowers = [];
      for await (const id of newFollowersGen) {
        newFollowers.push(id);
      }

      const followersCache = [
        ...newFollowers,
        ...mostRecentFollowers,
      ];
      this.setFollowersCache(followersCache);

      // We reverse the list of new followers so that the event source emits the
      // events for each follower in the same order that the followers followed
      // the account, from least to most recent.
      return newFollowers.reverse();
    },
  },
};

import common from "../common/followers.mjs";

export default {
  ...common,
  key: "twitter-new-follower-of-me",
  name: "New Follower of Me",
  description: "Emit new event when a user follows you on Twitter",
  version: "0.0.9",
  type: "source",
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
    _getHasExecuted() {
      return this.db.get("hasExecuted");
    },
    _setHasExecuted(hasExecuted) {
      this.db.set("hasExecuted", hasExecuted);
    },
    _wasComponentExecuted() {
      return !!this._getHasExecuted();
    },
    _markComponentAsExecuted() {
      this._setHasExecuted(true);
    },
    getFollowersCacheSize() {
      return this.followersCacheSize;
    },
    async getRelevantIds() {
      const mostRecentFollowers = this.getFollowersCache();
      if (!this._wasComponentExecuted()) {
        this._markComponentAsExecuted();

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

const common = require("../common-followers");

module.exports = {
  ...common,
  key: "twitter-new-follower-of-me",
  name: "New Follower of Me",
  description: "Emit an event when a user follows you on Twitter",
  version: "0.0.3",
  methods: {
    ...common.methods,
    getRelevantIds() {
      const isFirstExecution = !this.db.get("hasExecuted");
      if (isFirstExecution) {
        this.db.set("hasExecuted", true);

        // The first time this event source is executed, it will emit an event
        // for the 100 most recent followers.
        const currFollowers = this.db.get("followers");
        return currFollowers
          .slice(0, 100)
          .reverse();
      }

      return this.getNewFollowers();
    },
  },
}

const common = require("../common-followers");

module.exports = {
  ...common,
  key: "twitter-new-follower-of-user",
  name: "New Follower of User",
  description: "Emit an event when a specific user gains a follower",
  version: "0.0.3",
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

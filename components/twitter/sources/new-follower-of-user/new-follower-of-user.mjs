import base from "../new-follower-of-me/new-follower-of-me.mjs";

export default {
  ...base,
  key: "twitter-new-follower-of-user",
  name: "New Follower of User",
  description: "Emit new event when a specific user gains a follower",
  version: "0.0.10",
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

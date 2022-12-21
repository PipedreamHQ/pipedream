import slack from "../slack/slack.app.mjs";

export default {
  ...slack,
  app: "slack_bot",
  methods: {
    ...slack.methods,
    getToken() {
      return this.$auth.bot_token;
    },
  },
};

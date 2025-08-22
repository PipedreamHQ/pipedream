import slack from "@pipedream/slack";

export default {
  ...slack,
  app: "slack_bot",
  methods: {
    ...slack.methods,
    getToken() {
      return this.$auth.bot_token;
    },
    async makeRequest({
      method = "", ...args
    } = {}) {
      let response;
      const props = method.split(".");
      const sdk = props.reduce((reduction, prop) =>
        reduction[prop], this.sdk());

      try {
        response = await sdk(args);
      } catch (error) {
        const {
          error: e, needed, provided,
        } = error.data;
        if (e === "missing_scope") {
          throw `"Scope(s) \`${needed}\` missing from your Slack app. 
            Scopes provided: \`${provided}\`".`;
        }
        console.log(`Error calling ${method}`, error);
        throw error;
      }

      if (!response.ok) {
        console.log(`Error in response with method ${method}`, response.error);
        throw response.error;
      }
      return response;
    },
  },
};

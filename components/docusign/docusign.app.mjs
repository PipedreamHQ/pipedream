import common from "./common.mjs";

export default {
  ...common,
  type: "app",
  app: "docusign",
  methods: {
    ...common.methods,
    async getUserInfo({ $ }) {
      const config = {
        method: "GET",
        url: "https://account.docusign.com/oauth/userinfo",
      };
      return this._makeRequest({
        $,
        config,
      });
    },
  },
};

import common from "../docusign/common.mjs";

export default {
  ...common,
  type: "app",
  app: "docusign_developer",
  methods: {
    ...common.methods,
    async getUserInfo({ $ }) {
      const config = {
        method: "GET",
        url: "https://account-d.docusign.com/oauth/userinfo",
      };
      return this._makeRequest({
        $,
        config,
      });
    },
  },
};

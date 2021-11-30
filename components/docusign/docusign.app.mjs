import common from "./common.mjs";

export default {
  ...common,
  type: "app",
  app: "docusign",
  methods: {
    ...common.methods,
    async getUserInfo() {
      return await this._makeRequest(
        "GET",
        "https://account.docusign.com/oauth/userinfo",
      );
    },
  }
};

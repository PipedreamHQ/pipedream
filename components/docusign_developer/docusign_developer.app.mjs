import common from "../docusign/common.mjs";

export default {
  ...common,
  type: "app",
  app: "docusign_developer",
  methods: {
    ...common.methods,
    async getUserInfo() {
      return await this._makeRequest(
        "GET",
        "https://account-d.docusign.com/oauth/userinfo",
      );
    },
  }
};
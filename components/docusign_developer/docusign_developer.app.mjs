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
      return await this._makeRequest({
        $,
        config,
      });
    },
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
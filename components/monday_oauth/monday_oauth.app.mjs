import common from "@pipedream/monday";
import mondaySdk from "monday-sdk-js";

export default {
  ...common,
  app: "monday_oauth",
  methods: {
    ...common.methods,
    async makeRequest({
      query, options,
    }) {
      const monday = mondaySdk();
      monday.setToken(this.$auth.oauth_access_token);
      return monday.api(query, options);
    },
  },
};

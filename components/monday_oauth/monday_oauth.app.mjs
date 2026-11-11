import { ApiClient } from "@mondaydotcomorg/api";
import common from "@pipedream/monday";

export default {
  ...common,
  app: "monday_oauth",
  methods: {
    ...common.methods,
    _client() {
      return new ApiClient({
        token: this.$auth.oauth_access_token,
      });
    },
  },
};

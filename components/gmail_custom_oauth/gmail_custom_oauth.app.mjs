import base from "../gmail/gmail.app.mjs";
import gmail from "@googleapis/gmail";

export default {
  ...base,
  type: "app",
  app: "gmail_custom_oauth",
  methods: {
    _accessToken(){
      return this.$auth.oauth_access_token;
    },
    _client() {
      const auth = new gmail.auth.OAuth2();
      auth.setCredentials({
        access_token: this._accessToken(),
      });
      return gmail.gmail({
        version: "v1",
        auth,
      });
    },
  },
};

import base from "../gmail/gmail.app.mjs";
import gmail from "@googleapis/gmail";

export default {
  ...base,
  type: "app",
  app: "gmail_custom_oauth",
  methods: {
    ...base.methods,
    _accessToken() {
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
    async updateSignature(signature, email) {
      return this._client().users.settings.sendAs.patch({
        userId: "me",
        sendAsEmail: email,
        requestBody: {
          signature,
        },
      });
    },
  },
};

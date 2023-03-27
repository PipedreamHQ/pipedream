import base from "../gmail/gmail.app.mjs";
import { google } from "googleapis";
import gmail from "@googleapis/gmail";

export default {
  ...base,
  type: "app",
  app: "gmail_custom_oauth",
  propDefinitions: {
    ...base.propDefinitions,
    attachmentId: {
      type: "string",
      label: "Attachment",
      description: "Identifier of the attachment to download",
      async options({ messageId }) {
        const { payload: { parts } } = await this.getMessage({
          id: messageId,
        });
        return parts?.filter(({ body }) => body.attachmentId )
          ?.map(({ body }) => body.attachmentId ) || [];
      },
    },
  },
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
    _serviceAccountAuth(credentials, impersonatedUser) {
      const scopes = [
        "https://www.googleapis.com/auth/gmail.settings.basic",
      ];
      return new google.auth.JWT(
        credentials.client_email,
        null,
        credentials.private_key,
        scopes,
        impersonatedUser,
      );
    },
    async updateSignature({
      signature, email, credentials,
    }) {
      const opts = {
        userId: "me",
        sendAsEmail: email,
        requestBody: {
          signature,
        },
      };
      if (credentials) opts.auth = this._serviceAccountAuth(credentials, email);
      return this._client().users.settings.sendAs.patch(opts);
    },
    async getAttachment({
      messageId, attachmentId,
    }) {
      const { data } = await this._client().users.messages.attachments.get({
        userId: "me",
        messageId,
        id: attachmentId,
      });
      return data;
    },
  },
};

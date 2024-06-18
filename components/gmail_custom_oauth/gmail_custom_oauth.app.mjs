import gmail from "@googleapis/gmail";
import { axios } from "@pipedream/platform";
import { google } from "googleapis";
import base from "../gmail/gmail.app.mjs";

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
    _apiUrl() {
      return "https://www.googleapis.com/gmail/v1/users/me";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, config);
    },
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
    getMessagesWithRetry(ids = [], maxRetries = 3) {
      const getMessageWithRetry = async (id, retryCount = 0) => {
        try {
          return await this.getMessage({
            id,
          });
        } catch (err) {
          console.error(`Failed to get message with id ${id}:`, err);
          if (retryCount < maxRetries) {
            console.log("Retrying...");
            return await getMessageWithRetry(id, retryCount + 1);
          }
          console.error("Failed after 3 attempts.");
          return null;
        }
      };

      const promises = ids.map((id) => getMessageWithRetry(id));
      return Promise.all(promises);
    },
  },
};

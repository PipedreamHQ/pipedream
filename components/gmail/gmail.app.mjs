import gmail from "@googleapis/gmail";
import MailComposer from "nodemailer/lib/mail-composer/index.js";
import { convert } from "html-to-text";
import {
  axios,
  ConfigurationError,
} from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "gmail",
  propDefinitions: {
    message: {
      type: "string",
      label: "Message",
      async options({ prevContext }) {
        const {
          messages,
          nextPageToken,
        } = await this.listMessages({
          pageToken: prevContext?.nextPageToken,
        });

        const options = await Promise.all(messages.map(async (message) => {
          const subject = await this.getMessageSubject({
            id: message.id,
          });
          return {
            label: subject,
            value: message.id,
          };
        }));

        return {
          options,
          context: {
            nextPageToken,
          },
        };
      },
    },

    label: {
      type: "string",
      label: "Label",
      description: "Labels are used to categorize messages and threads within the user's mailbox",
      async options() {
        const { labels } = await this.listLabels();
        return labels.map((label) => ({
          label: label.name,
          value: label.id,
        }));
      },
    },
    signature: {
      type: "string",
      label: "Signature",
      description: "An HTML signature composed in the Gmail Web UI that will be included in the message",
      optional: true,
      async options() {
        const { sendAs } = await this.listSignatures();
        return sendAs
          .filter(({ signature }) => signature)
          .map(({ signature }) => ({
            label: convert(signature),
            value: signature,
          }));
      },
    },
    delegate: {
      type: "string",
      label: "Send as a Delegate",
      description: "[Delegates](https://developers.google.com/gmail/api/reference/rest/v1/users.settings.delegates) are only available to service account clients that have been delegated domain-wide authority",
      optional: true,
      async options() {
        try {
          const { delegates } = await this.listDelegates();
          return delegates.map(({ delegateEmail }) => delegateEmail);
        } catch (e) {
          throw new ConfigurationError(e);
        }
      },
    },
    q: {
      type: "string",
      label: "Search Query",
      description: "Apply a search filter using Gmail's [standard search operators](https://support.google.com/mail/answer/7190)",
      optional: true,
    },
  },
  methods: {
    _client() {
      const auth = new gmail.auth.OAuth2();
      auth.setCredentials({
        access_token: this.$auth.oauth_access_token,
      });
      return gmail.gmail({
        version: "v1",
        auth,
      });
    },
    async userInfo() {
      const {
        name,
        email,
      } = await axios(this, {
        url: "https://www.googleapis.com/oauth2/v1/userinfo",
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
      return {
        name,
        email,
      };
    },
    async listMessages({ ...opts }) {
      const { data } = await this._client().users.messages.list({
        userId: constants.USER_ID,
        ...opts,
      });
      return data;
    },
    async getMessage({ id }) {
      const { data } = await this._client().users.messages.get({
        userId: constants.USER_ID,
        id,
      });
      return data;
    },
    async getMessageSubject({ id }) {
      const message = await this.getMessage({
        id,
      });
      const { value: subject } = message.payload.headers.find(({ name }) => name === "Subject");
      return subject;
    },
    async getMessages(ids = []) {
      const promises = ids.map((id) => this.getMessage({
        id,
      }));
      return Promise.all(promises);
    },
    async listSignatures() {
      const { data } = await this._client().users.settings.sendAs.list({
        userId: constants.USER_ID,
      });
      return data;
    },
    async listLabels() {
      const { data } = await this._client().users.labels.list({
        userId: constants.USER_ID,
      });
      // user-created labels first
      data.labels.sort((a) => a.type === "system"
        ? 1
        : -1);
      return data;
    },
    async listDelegates() {
      const { data } = await this._client().users.settings.delegates.list({
        userId: constants.USER_ID,
      });
      return data;
    },
    encodeMessage(message) {
      return Buffer.from(message)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    },
    async sendEmail({ ...opts }) {
      const {
        threadId,
        ...options
      } = opts;
      const mailComposer = new MailComposer(options);
      const mail = mailComposer.compile();
      mail.keepBcc = true;
      const message = await mail.build();
      //Some headers are seperated with a new-line
      const messageFixed = message.toString("utf8")
        .replace(/:\r\n/g, ":")
        .replace(/:\n/g, ":");
      const rawMessage = this.encodeMessage(messageFixed);
      try {
        const response = await this._client().users.messages.send({
          userId: constants.USER_ID,
          requestBody: {
            threadId: threadId,
            raw: rawMessage,
          },
        });
        return response.data;
      } catch (err) {
        if (err.code == 404) {
          throw new Error("Unable to find email thread. `In Reply To` must be the `message-id` of the first message of the thread.");
        } else {
          throw err;
        }
      }
    },
    async addLabelToEmail({
      message, label,
    }) {
      const response = await this._client().users.messages.modify({
        userId: constants.USER_ID,
        id: message,
        requestBody: {
          addLabelIds: [
            label,
          ],
        },
      });
      return response.data;
    },
  },
};

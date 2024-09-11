import gmail from "@googleapis/gmail";
import {
  axios,
  ConfigurationError,
} from "@pipedream/platform";
import { convert } from "html-to-text";
import mime from "mime/types/standard.js";
import MailComposer from "nodemailer/lib/mail-composer/index.js";
import constants from "./common/constants.mjs";
import { google } from "googleapis";

export default {
  type: "app",
  app: "gmail",
  propDefinitions: {
    message: {
      type: "string",
      label: "Message",
      description: "The identifier of a message",
      useQuery: true,
      async options({
        prevContext, query,
      }) {
        const {
          messages,
          nextPageToken,
        } = await this.listMessages({
          pageToken: prevContext?.nextPageToken,
          q: query,
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
    messageWithAttachments: {
      type: "string",
      label: "Message",
      description: "The identifier of a message",
      useQuery: true,
      async options({
        prevContext, query,
      }) {
        const {
          messages,
          nextPageToken,
        } = await this.listMessages({
          pageToken: prevContext?.nextPageToken,
          q: query,
        });
        const options = await Promise.all(messages.map(async (message) => {
          const { payload } = await this.getMessage({
            id: message.id,
          });
          const { value: subject } = payload.headers.find(({ name }) => name === "Subject");
          const hasAttachments = payload?.parts?.filter(({ body }) => body.attachmentId );
          return {
            label: subject,
            value: message.id,
            hasAttachments: !!hasAttachments?.length,
          };
        }));
        return {
          options: options?.filter(({ hasAttachments }) => hasAttachments) || [],
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
    messageLabels: {
      type: "string[]",
      label: "Message Labels",
      description: "Labels are used to categorize messages and threads within the user's mailbox",
      async options({
        messageId, type = "add",
      }) {
        const { labels } = await this.listLabels();
        const { labelIds } = await this.getMessage({
          id: messageId,
        });
        return labels
          .filter(({ id }) => type === "add"
            ? !labelIds.includes(id)
            : labelIds.includes(id))
          .map((label) => ({
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
    attachmentId: {
      type: "string",
      label: "Attachment",
      description: "Identifier of the attachment to download",
      async options({ messageId }) {
        try {
          const { payload: { parts } } = await this.getMessage({
            id: messageId,
          });
          return parts?.filter(({ body }) => body.attachmentId )
            ?.map(({
              body, filename,
            }) => ({
              value: body.attachmentId,
              label: filename,
            })) || [];
        } catch {
          return [];
        }
      },
    },
    q: {
      type: "string",
      label: "Search Query",
      description: "Apply a search filter using Gmail's [standard search operators](https://support.google.com/mail/answer/7190)",
      optional: true,
    },

    to: {
      type: "string[]",
      label: "To",
      description: "Enter a single recipient's email or multiple emails as items in an array.",
    },
    cc: {
      type: "string[]",
      label: "Cc",
      optional: true,
      description: "Enter a single recipient's email or multiple emails as items in an array.",
    },
    bcc: {
      type: "string[]",
      label: "Bcc",
      optional: true,
      description: "Enter a single recipient's email or multiple emails as items in an array.",
    },
    fromName: {
      type: "string",
      label: "From Name",
      description: "Specify the name that will be displayed in the \"From\" section of the email.",
      optional: true,
    },
    fromEmail: {
      type: "string",
      label: "From Email",
      description: "Specify the email address that will be displayed in the \"From\" section of the email.",
      optional: true,
      async options() {
        const { sendAs } = await this.listSignatures();
        return sendAs
          .filter(({ sendAsEmail }) => sendAsEmail)
          .map(({ sendAsEmail }) => sendAsEmail);
      },
    },
    replyTo: {
      type: "string",
      label: "Reply To",
      description: "Specify the email address that will appear on the \"Reply-To\" field, if different than the sender's email.",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Specify a subject for the email.",
    },
    body: {
      type: "any",
      label: "Email Body",
      description: "Include an email body as either plain text or HTML. If HTML, make sure to set the \"Body Type\" prop to `html`.",
    },
    bodyType: {
      type: "string",
      label: "Body Type",
      description: "Choose to send as plain text or HTML. Defaults to `plaintext`.",
      optional: true,
      default: "plaintext",
      options: Object.values(constants.BODY_TYPES),
    },
    attachmentFilenames: {
      type: "string[]",
      label: "Attachment Filenames",
      description: "Array of the names of the files to attach. Must contain the file extension (e.g. `.jpeg`, `.txt`). Use in conjuction with `Attachment URLs or Paths`.",
      optional: true,
    },
    attachmentUrlsOrPaths: {
      type: "string[]",
      label: "Attachment URLs or Paths",
      description: "Array of the URLs of the download links for the files, or the local paths (e.g. `/tmp/my-file.txt`). Use in conjuction with `Attachment Filenames`.",
      optional: true,
    },
    inReplyTo: {
      type: "string",
      label: "In Reply To",
      description: "Specify the `message-id` this email is replying to. Must be from the first message sent in the thread. To use this prop with `async options` please use `Gmail (Developer App)` `Send Email` component.",
      optional: true,
    },
    mimeType: {
      type: "string",
      label: "Mime Type",
      description: "Mime Type of attachments. Setting the mime-type will override using the filename extension to determine attachment's content type.",
      optional: true,
      options() {
        return Object.keys(mime);
      },
    },
  },
  methods: {
    getToken() {
      return this.$auth.oauth_access_token;
    },
    _client() {
      const auth = new gmail.auth.OAuth2();
      auth.setCredentials({
        access_token: this.getToken(),
      });
      return gmail.gmail({
        version: "v1",
        auth,
      });
    },
    async getOptionsToSendEmail($, props) {
      const {
        name: fromName,
        email,
      } = await this.userInfo();
      const fromEmail = props.fromEmail || email;

      const opts = {
        from: props.fromName
          ? `${props.fromName} <${fromEmail}>`
          : `${fromName} <${fromEmail}>`,
        to: props.to,
        cc: props.cc,
        bcc: props.bcc,
        replyTo: props.replyTo,
        subject: props.subject,
      };

      if (props.inReplyTo) {
        try {
          const repliedMessage = await this.getMessage({
            id: props.inReplyTo,
          });
          const { value: subject } = repliedMessage.payload.headers.find(({ name }) => name === "Subject");
          //sometimes coming as 'Message-ID' and sometimes 'Message-Id'
          const { value: inReplyTo } = repliedMessage.payload.headers.find(({ name }) => name.toLowerCase() === "message-id");
          opts.subject = `Re: ${subject}`;
          opts.inReplyTo = inReplyTo;
          opts.references = inReplyTo;
          opts.threadId = repliedMessage.threadId;
        } catch (err) {
          opts.threadId = props.inReplyTo;
        }
      }

      if (props.attachmentFilenames?.length && props.attachmentUrlsOrPaths?.length) {
        opts.attachments = [];
        for (let i = 0; i < props.attachmentFilenames.length; i++) {
          opts.attachments.push({
            filename: props.attachmentFilenames[i],
            path: props.attachmentUrlsOrPaths[i],
          });
        }
      }

      if (props.bodyType === constants.BODY_TYPES.HTML) {
        opts.html = props.body;
      } else {
        opts.text = props.body;
      }

      return opts;
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
      const fn = () => this._client().users.messages.get({
        userId: constants.USER_ID,
        id,
      });
      const { data } = await this.retryWithExponentialBackoff(fn);
      return data;
    },
    async listHistory(opts = {}) {
      const { data } = await this._client().users.history.list({
        userId: constants.USER_ID,
        ...opts,
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
    async *getAllMessages(ids = []) {
      for (const id of ids) {
        const message = await this.getMessage({
          id,
        });
        yield message;
      }
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
    async updateLabels({
      message, addLabelIds = [], removeLabelIds = [],
    }) {
      const response = await this._client().users.messages.modify({
        userId: constants.USER_ID,
        id: message,
        requestBody: {
          addLabelIds,
          removeLabelIds,
        },
      });
      return response.data;
    },
    async createDraft({ ...opts }) {
      const {
        threadId,
        ...options
      } = opts;
      const mail = new MailComposer(options);
      mail.keepBcc = true;
      const message = await mail.compile().build();
      try {
        const response = await this._client().users.drafts.create({
          userId: constants.USER_ID,
          requestBody: {
            message: {
              threadId: threadId,
              raw: message.toString("base64"),
            },
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
    retryWithExponentialBackoff(func, maxAttempts = 3, baseDelayS = 2) {
      let attempt = 0;

      const execute = async () => {
        try {
          return await func();
        } catch (error) {
          if (attempt >= maxAttempts) {
            throw error;
          }

          const delayMs = Math.pow(baseDelayS, attempt) * 1000;
          await new Promise((resolve) => setTimeout(resolve, delayMs));

          attempt++;
          return execute();
        }
      };

      return execute();
    },
  },
};

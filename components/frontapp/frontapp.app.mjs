import frontapp from "api";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "frontapp",
  propDefinitions: {
    bodyFormat: {
      type: "string",
      description: "Format of the message body. Ignored if the message type is not email. Can be one of: 'html', 'markdown'. (Default: 'markdown')",
      optional: true,
      options: [
        "html",
        "markdown",
      ],
    },
    threadRef: {
      type: "string",
      description: "Custom reference which will be used to thread messages. If you omit this field, we'll thread by sender instead.",
      optional: true,
    },
    attachments: {
      type: "string[]",
      description: "Binary data of the attached files. Base64 encoded strings are supported. e.g. `data:image/jpeg;name=logo.jpg;base64,/9j/4QAYRXh...`",
      optional: true,
    },
  },
  methods: {
    sdk({
      method = constants.METHOD.GET, path, data, params,
    } = {}) {
      const args = [
        path,
        data,
        params,
      ].filter((arg) => arg);
      return frontapp(this.$auth.oauth_access_token)[method](...args);
    },
    async importMessage(args = {}) {
      return this.sdk({
        method: constants.METHOD.IMPORT_INBOX_MESSAGE,
        ...args,
      });
    },
    async sendMessage({
      channelId, ...args
    } = {}) {
      return this.sdk({
        method: constants.METHOD.POST,
        path: `/channels/${channelId}/messages`,
        ...args,
      });
    },
    async updateConversation({
      conversationId, ...args
    } = {}) {
      return this.sdk({
        method: constants.METHOD.PATCH,
        path: `/conversations/${conversationId}`,
        ...args,
      });
    },
    async receiveCustomMessages({
      channelId, ...args
    }) {
      return this.sdk({
        method: constants.METHOD.POST,
        path: `/channels/${channelId}/incoming_messages`,
        ...args,
      });
    },
  },
};

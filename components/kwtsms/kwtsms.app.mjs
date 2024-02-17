import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "kwtsms",
  propDefinitions: {
    senderId: {
      type: "string",
      label: "Sender ID",
      description: "The sender ID of the SMS message. Use your private senderid or one of ours. SenderID is case sensitive. If **Sender ID** has spaces, replace them with `+` sign.",
      async options() {
        const { senderid } = await this.listSenderIds();
        return senderid;
      },
    },
    mobile: {
      type: "string",
      label: "Mobile",
      description: "List of mobile numbers separated by `,` commas. Characters like `+`, `00`, `.` or space in numbers are not allowed.",
    },
    lang: {
      type: "integer",
      label: "Language",
      description: "Language of the SMS message.",
      options: [
        {
          label: "English (ASCII)",
          value: 1,
        },
        {
          label: "Arabic (CP1256)",
          value: 2,
        },
        {
          label: "Arabic (UTF-8)",
          value: 3,
        },
        {
          label: "Unicode",
          value: 4,
        },
      ],
    },
    message: {
      type: "string",
      label: "Message",
      description: "The content of the SMS message to send. Spaces must be converted to `+` sign (do not encode), use `\n` for new lines.",
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getData(data) {
      return {
        ...data,
        username: this.$auth.api_username,
        password: this.$auth.api_password,
      };
    },
    async _makeRequest({
      $ = this, path, data, headers, ...args
    } = {}) {
      const response = await axios($, {
        ...args,
        url: this.getUrl(path),
        data: this.getData(data),
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        ...args,
      });

      if (response?.result && response.result !== "OK") {
        throw new Error(JSON.stringify(response, null, 2));
      }

      return response;
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    listSenderIds(args = {}) {
      return this.post({
        path: "/senderid/",
        ...args,
      });
    },
  },
};

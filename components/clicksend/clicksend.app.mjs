import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "clicksend",
  propDefinitions: {
    listId: {
      type: "integer",
      label: "List ID",
      description: "The ID of the list to add the contact to.",
      async options({
        page, prevContext: { hasMore },
      }) {
        if (hasMore === false) {
          return [];
        }
        const {
          data: { data },
          next_page_url: nextPageUrl,
        } = await this.getLists({
          params: {
            page: page + 1,
            limit: constants.DEFAULT_LIMIT,
          },
        });
        const options = data?.map(({
          list_id: value, list_name: label,
        }) => ({
          label,
          value,
        })) || [];
        return {
          options,
          context: {
            hasMore: !!nextPageUrl,
          },
        };
      },
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the contact, in [E.164](https://en.wikipedia.org/wiki/E.164) format. Must be provided if no **Fax Number** or **Email**.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the contact. Must be provided if no **Phone Number** or **Fax Number**.",
      optional: true,
    },
    faxNumber: {
      type: "string",
      label: "Fax Number",
      description: "The fax number of the contact. Must be provided if no **Phone Number** or **Email**.",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the contact.",
      optional: true,
    },
    from: {
      type: "string",
      label: "Sender ID",
      description: "The sender ID to use when sending the SMS or MMS message.",
      async options() {
        const { data } = await this.getAccount();
        return [
          {
            label: data.username,
            value: data.user_id,
          },
        ];
      },
    },
    body: {
      type: "string",
      label: "Message",
      description: "The SMS, MMS or Voice message to send.",
    },
    to: {
      type: "string",
      label: "Recipient Phone Number",
      description: "The phone number of the recipient, in [E.164](https://en.wikipedia.org/wiki/E.164) format.",
      optional: true,
    },
    dedicatedNumber: {
      type: "string",
      label: "Dedicated Number",
      description: "",
      async options({
        page, prevContext: { hasMore },
      }) {
        if (hasMore === false) {
          return [
            {
              label: "All Numbers",
              value: "*",
            },
          ];
        }
        const {
          data: { data },
          next_page_url: nextPageUrl,
        } = await this.getNumbers({
          params: {
            page: page + 1,
            limit: constants.DEFAULT_LIMIT,
          },
        });
        const options = data?.map(({ dedicated_number: value }) => value) || [];
        return {
          options,
          context: {
            hasMore: !!nextPageUrl,
          },
        };
      },
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Content-Type": "application/json",
      };
    },
    getAuth() {
      const {
        username,
        api_key: password,
      } = this.$auth;
      return {
        username,
        password,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
        auth: this.getAuth(),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        method: "DELETE",
        ...args,
      });
    },
    sendVoiceMessage(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/voice/send",
        ...args,
      });
    },
    getAccount(args = {}) {
      return this._makeRequest({
        path: "/account",
        ...args,
      });
    },
    getLists(args = {}) {
      return this._makeRequest({
        path: "/lists",
        ...args,
      });
    },
    getNumbers(args = {}) {
      return this._makeRequest({
        path: "/numbers",
        ...args,
      });
    },
  },
};

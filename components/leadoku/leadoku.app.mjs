import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "leadoku",
  propDefinitions: {},
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.leadoku.io";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async emitNewConnectionEvent() {
      const event = {
        name: "New Connection",
        data: {},
      };
      this.$emit(event, {
        summary: event.name,
      });
    },
    async emitNewResponderEvent() {
      const event = {
        name: "New Responder",
        data: {},
      };
      this.$emit(event, {
        summary: event.name,
      });
    },
    async emitNewMessageEvent(message) {
      const event = {
        name: "New Message",
        data: {
          message,
        },
      };
      this.$emit(event, {
        summary: event.name,
      });
    },
  },
};

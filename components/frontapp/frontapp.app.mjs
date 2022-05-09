import frontapp from "api";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "frontapp",
  propDefinitions: {},
  methods: {
    sdk({
      method = constants.METHOD.GET, data, params,
    } = {}) {
      const args = [
        data,
        params,
      ].filter((arg) => arg);
      return frontapp(this.$auth.oauth_access_token)[method](...args);
    },
    // await this.frontapp.importMessage({ params, data });
    async importMessage(args = {}) {
      return this.sdk({
        method: constants.METHOD.IMPORT_INBOX_MESSAGE,
        ...args,
      });
    },
    // await this.frontapp.sendMessage({ params, data });
    async sendMessage(args = {}) {
      return this.sdk({
        method: constants.METHOD.POST,
        ...args,
      });
    },
    // await this.frontapp.updateConversation({ params, data });
    async updateConversation(args = {}) {
      return this.sdk({
        method: constants.METHOD.PATCH,
        ...args,
      });
    },
  },
};

import { Client as PlivoClient } from "plivo";
// import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "plivo",
  propDefinitions: {
    commonProperty: {
      type: "string",
      label: "Common property",
      description: "[See the docs here](https://example.com)",
    },
  },
  methods: {
    client() {
      const {
        auth_id: authId,
        auth_token: authToken,
      } = this.$auth;
      return new PlivoClient(authId, authToken);
    },
    async makeRequest({
      path = "", args = [],
    } = {}) {
      const props = path.split(".");
      const api = props.reduce((reduction, prop) =>
        reduction[prop], this.client());

      try {
        await api(...args);
      } catch (error) {
        console.log(`Error calling ${path}`, error);
        throw error;
      }
    },
    makeOutboundCall(args = []) {
      return this.makeRequest({
        path: "calls.create",
        args,
      });
    },
    playAudioOnCall(args = []) {
      return this.makeRequest({
        path: "calls.playMusic",
        args,
      });
    },
    sendSMSMMS(args = []) {
      return this.makeRequest({
        path: "messages.create",
        args,
      });
    },
    listAccountPhoneNumbers(args = []) {
      return this.makeRequest({
        path: "numbers.list",
        args,
      });
    },
  },
};

import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "inmobile",
  methods: {
    getUrl(path) {
      return `https://api.inmobile.com/v4${path}`;
    },
    getAuth() {
      return {
        username: "x",
        password: this.$auth.api_key,
      };
    },
    makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: this.getUrl(path),
        auth: this.getAuth(),
        ...args,
      });
    },
    post(args = {}) {
      return this.makeRequest({
        method: "POST",
        ...args,
      });
    },
    sendSms(args = {}) {
      return this.post({
        path: "/sms/outgoing",
        ...args,
      });
    },
  },
};

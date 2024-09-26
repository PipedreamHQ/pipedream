import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "realgeeks",
  methods: {
    async _makeRequest({
      $ = this,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        baseURL: "https://receivers.leadrouter.realgeeks.com/rest",
        auth: {
          username: this.$auth.username,
          password: this.$auth.password,
        },
      });
    },
    async createLead(args) {
      return this._makeRequest({
        method: "post",
        url: `/sites/${this.$auth.site_uuid}/leads`,
        ...args,
      });
    },
  },
};

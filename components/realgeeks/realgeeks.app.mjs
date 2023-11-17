import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "realgeeks",
  propDefinitions: {
    leadName: {
      type: "string",
      label: "Lead Name",
      description: "The name of the lead to create",
    },
    leadEmail: {
      type: "string",
      label: "Lead Email",
      description: "The email of the lead to create",
    },
    leadPhone: {
      type: "string",
      label: "Lead Phone",
      description: "The phone number of the lead to create",
      optional: true,
    },
    leadSource: {
      type: "string",
      label: "Lead Source",
      description: "The source of the lead",
      optional: true,
    },
    leadStatus: {
      type: "string",
      label: "Lead Status",
      description: "The status of the lead",
      optional: true,
    },
  },
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
        url: `/sites/${this.$auth.site_uuid}/users`,
        ...args,
      });
    },
  },
};

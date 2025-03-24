import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "smslink_nc",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact to delete or manipulate.",
      async options({
        mapper = ({
          id: value, phone_number: phoneNumber, first_name: firstName, last_name: lastName,
        }) => ({
          value,
          label: `${firstName || ""} ${lastName || ""} (${phoneNumber})`.trim(),
        }),
      }) {
        const { object: { data } } = await this.getContacts();
        return data.map(mapper);
      },
    },
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "The ID of the SMS campaign to delete or manipulate.",
      async options() {
        const { object: { data } } = await this.getSMSCampaigns();
        return data.map(({
          id: value, title: label,
        }) => ({
          value,
          label,
        }));
      },
    },
  },
  methods: {
    getUrl(path) {
      return `https://api.smslink.nc/api${path}`;
    },
    getHeaders(headers) {
      return {
        Accept: "application/json",
        Authorization: `Bearer ${this.$auth.personal_access_token}`,
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
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
    getContacts(args = {}) {
      return this._makeRequest({
        path: "/contact",
        ...args,
      });
    },
    getSMSCampaigns(args = {}) {
      return this._makeRequest({
        path: "/sms-campaign",
        ...args,
      });
    },
  },
};

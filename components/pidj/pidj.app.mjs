import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "pidj",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact.",
      async options() {
        const { contacts } = await this.listContacts();

        return contacts.map(({
          id: value, first_name, last_name, display_name, phone_number,
        }) => ({
          label: (first_name && last_name)
            ? `${first_name} ${last_name}`
            : `${display_name || phone_number}`,
          value,
        }));
      },
    },
    groupId: {
      type: "string",
      label: "Group Id",
      description: "The Id of the group.",
      async options() {
        const { groups } = await this.listGroups();

        return groups.map(({
          group_id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
      optional: true,
    },
    surveyId: {
      type: "string",
      label: "Survey ID",
      description: "The ID of the survey to be triggered.",
      async options() {
        const { surveys } = await this.listSurveys();

        return surveys.map(({
          survey_id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    fromNumber: {
      type: "string",
      label: "From Number",
      description: "Phone number to send from; this will determine which group the message sends from, and must be an active number from one of your groups. This must be in E.164 format, e.g., +18885552222",
    },
    toNumber: {
      type: "string",
      label: "To Number",
      description: "Phone number to send to. This must be in E.164 format, e.g., +18885553333.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.gopidj.com/api/2020";
    },
    _auth() {
      return {
        username: `${this.$auth.account_key}`,
        password: `${this.$auth.token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        auth: this._auth(),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        ...opts,
      });
    },
    addContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contact",
        ...opts,
      });
    },
    listGroups() {
      return this._makeRequest({
        path: "/groups",
      });
    },
    listSurveys() {
      return this._makeRequest({
        path: "/surveys",
      });
    },
    listContacts() {
      return this._makeRequest({
        path: "/contacts",
      });
    },
    triggerSurvey(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/survey/initiate",
        ...opts,
      });
    },
    sendMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/send",
        ...opts,
      });
    },
  },
};

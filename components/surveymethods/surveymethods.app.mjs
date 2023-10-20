import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "surveymethods",
  propDefinitions: {
    emailListCode: {
      label: "Email List Code",
      description: "The email list code",
      type: "string",
      async options() {
        const emailLists = await this.getEmailLists({});

        return emailLists.map((emailList) => ({
          label: emailList.name,
          value: emailList.code,
        }));
      },
    },
    surveyCode: {
      label: "Survey Code",
      description: "The survey code",
      type: "string",
      async options({ page }) {
        const surveys = await this.getSurveys({
          page: page + 1,
        });

        return surveys.map((survey) => ({
          label: survey.title,
          value: survey.code,
        }));
      },
    },
  },
  methods: {
    _loginId() {
      return this.$auth.login_id;
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return `https://api.surveymethods.com/v1/${this._loginId()}/${this._apiKey()}`;
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        ...args,
      });
    },
    async createWebhook({ ...args } = {}) {
      return this._makeRequest({
        path: "/webhooks/subscribe",
        method: "post",
        ...args,
      });
    },
    async removeWebhook({ ...args } = {}) {
      return this._makeRequest({
        path: "/webhooks/unsubscribe",
        method: "post",
        ...args,
      });
    },
    async getEmailLists({ ...args } = {}) {
      const response = await this._makeRequest({
        path: "/emaillists/codes",
        ...args,
      });

      return response.email_lists;
    },
    async getSurveys({
      perPage = 100, page = 1, ...args
    } = {}) {
      try {
        const response = await this._makeRequest({
          path: `/surveys/details/${perPage}/${page}`,
          ...args,
        });

        return response?.pages[0]?.surveys ?? [];

      } catch (error) {
        return [];
      }
    },
    async getResponses({
      surveyCode, perPage = 100, page = 1, ...args
    } = {}) {
      try {
        const response = await this._makeRequest({
          path: `/responses/${surveyCode}/summary/${perPage}/${page}`,
          ...args,
        });

        return response?.pages[0]?.responses ?? [];
      } catch (error) {
        // This API returns a error when don't have responses for a survey.
        return [];
      }
    },
    async createEmailList({ ...args } = {}) {
      return this._makeRequest({
        path: "/emaillists/create",
        method: "post",
        ...args,
      });
    },
    async addContactToEmailList({
      emailListCode, email, ...args
    } = {}) {
      return this._makeRequest({
        path: `/emaillists/${emailListCode}/append/${email}`,
        method: "post",
        ...args,
      });
    },
  },
};

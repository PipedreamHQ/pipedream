import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zonka_feedback",
  propDefinitions: {
    // eslint-disable-next-line pipedream/props-description
    surveyId: {
      type: "string",
      label: "Survey ID",
      async options(page) {
        const surveys = await this.listSurveys({
          surveyStatus: "active",
          params: {
            page,
          },
        });
        return surveys.map((survey) => ({
          label: survey.name,
          value: survey.id,
        }));
      },
    },
    attributes: {
      type: "object",
      label: "Survey Attributes",
      description: "Key-value pair of survey attributes",
      optional: true,
    },
  },
  methods: {
    async _makeRequest({
      $ = this,
      method = "get",
      path,
      ...opts
    } = {}) {
      try {
        return await axios($, {
          headers: {
            "Z-API-TOKEN": this.$auth.auth_token,
          },
          url: `https://apis.zonkafeedback.com${path}`,
          method,
          ...opts,
        });
      } catch (error) {
        throw new Error(JSON.stringify(error.response.data, null, 2));
      }
    },
    async listSurveys(opts = {}) {
      return this._makeRequest({
        path: "/surveys",
        ...opts,
      });
    },
    async sendEmailSurvey(opts) {
      return this._makeRequest({
        path: "/sendemail",
        method: "post",
        ...opts,
      });
    },
    async sendSmsSurvey(opts) {
      return this._makeRequest({
        path: "/sendsms",
        method: "post",
        ...opts,
      });
    },
  },
};

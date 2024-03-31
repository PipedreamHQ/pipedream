import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "surveysparrow",
  propDefinitions: {
    survey: {
      type: "string",
      label: "Survey",
      description: "Identifier of a survey",
      async options({
        page, surveyType,
      }) {
        const { data: surveys } = await this.listSurveys({
          params: {
            page: page + 1,
            survey_type: surveyType,
          },
        });
        return surveys?.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        })) || [];
      },
    },
    surveyType: {
      type: "string",
      label: "Survey Type",
      description: "The type of survey",
      options: constants.SURVEY_TYPE_OPTIONS,
    },
    contactType: {
      type: "string",
      label: "Contact Type",
      description: "The type of contact",
      options: constants.CONTACT_TYPE_OPTIONS,
      optional: true,
    },
    visibility: {
      type: "string",
      label: "Visibility",
      description: "Visibility of the survey",
      options: constants.VISIBILITY_OPTIONS,
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the survey",
    },
    welcomeText: {
      type: "string",
      label: "Welcome Text",
      description: "Welcome Text of the survey",
      optional: true,
    },
    themeId: {
      type: "string",
      label: "Theme Id",
      description: "Id of the email theme.",
      async options({ page }) {
        const { data } = await this.listThemes({
          params: {
            page: page + 1,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.surveysparrow.com/v3";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    createWebhook(args = {}) {
      return this._makeRequest({
        path: "/webhooks",
        method: "POST",
        ...args,
      });
    },
    deleteWebhook({ hookId }) {
      return this._makeRequest({
        path: `/webhooks/${hookId}`,
        method: "DELETE",
      });
    },
    getResponse({
      responseId, ...args
    }) {
      return this._makeRequest({
        path: `/responses/${responseId}`,
        ...args,
      });
    },
    listSurveys(args = {}) {
      return this._makeRequest({
        path: "/surveys",
        ...args,
      });
    },
    listThemes(args = {}) {
      return this._makeRequest({
        path: "/email_themes",
        ...args,
      });
    },
    listResponses(args = {}) {
      return this._makeRequest({
        path: "/responses",
        ...args,
      });
    },
    createContact(args = {}) {
      return this._makeRequest({
        path: "/contacts",
        method: "POST",
        ...args,
      });
    },
    createSurvey(args = {}) {
      return this._makeRequest({
        path: "/surveys",
        method: "POST",
        ...args,
      });
    },
    updateSurvey({
      surveyId, ...args
    }) {
      return this._makeRequest({
        path: `/surveys/${surveyId}`,
        method: "PATCH",
        ...args,
      });
    },
    sendEmailShareTemplate({
      savedEmailTemplateName,
      recipientEmailAddress,
    }) {
      return this._makeRequest({
        path: "/share/email",
        method: "POST",
        data: {
          template_name: savedEmailTemplateName,
          recipient_email: recipientEmailAddress,
        },
      });
    },
    createChannel(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/channels",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const {
          data,
          has_next_page: hasNext,
        } = await fn({
          params,
          ...opts,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = hasNext;

      } while (hasMore);
    },
  },
};

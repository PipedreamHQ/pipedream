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
      async options({ page }) {
        const surveys = await this.listSurveys({
          params: {
            page: page + 1,
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
    surveyFolder: {
      type: "string",
      label: "Survey Folder",
      description: "Identifier of a folder",
      optional: true,
      async options({ page }) {
        const folders = await this.listSurveyFolders({
          params: {
            page: page + 1,
          },
        });
        return folders?.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        })) || [];
      },
    },
    theme: {
      type: "string",
      label: "Theme",
      description: "Identifier of an email theme",
      optional: true,
      async options({ page }) {
        const themes = await this.listEmailThemes({
          params: {
            page: page + 1,
          },
        });
        return themes?.map(({
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
  },
  methods: {
    _baseUrl() {
      return "https://api.surveysparrow.com/v3";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.access_token}`,
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
    listSurveys(args = {}) {
      return this._makeRequest({
        path: "/surveys",
        ...args,
      });
    },
    listSurveyFolders(args = {}) {
      return this._makeRequest({
        path: "/survey_folders",
        ...args,
      });
    },
    listEmailThemes(args = {}) {
      return this._makeRequest({
        path: "/email_themes",
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
  },
};
